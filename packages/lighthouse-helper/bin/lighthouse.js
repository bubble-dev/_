/* eslint-disable import/no-extraneous-dependencies, import/no-dynamic-require */
const lighthouse = require('lighthouse')
const { defaultSettings } = require('lighthouse/lighthouse-core/config/constants')
const chromeLauncher = require('chrome-launcher')
const puppetteer = require('puppeteer')
const { green, yellow } = require('chalk')
const lighthouseLogger = require('lighthouse-logger')
const y = require('yargs')
const { log, error, executeWithMessage } = require('./utils')
const {
  getReportFolder,
  getReportPath,
  generateReportForHash,
  generateDigests,
  getValue,
} = require('./lighthouse-utils')

// TODO: Make it possible to read from a lighthouse.config.js file to get some configs
// such as baseURL
const argv = y
  .scriptName('lighthouse-helper')
  .help('help')
  .version()
  .showHelpOnFail(false, 'Specify --help for available options')

  .usage('lighthouse-helper <url> <options>')
  .example(
    'lighthouse <url> --use-headless=false', 'Opens a headfull chrome instance to display the lighthouse test being ran against the given url'
  )
  .config('config')

  // List of options
  .group(
    [
      'use-headless',
      'local-run',
      'update-remote',
      'benchmark',
    ],
    'Configuration:'
  )
  .describe({
    'use-headless': 'Choose between headless or headfull run',
    'local-run': 'Indicates that the tool is making a "local" run on your computer. This is a safety mechanism to avoid unintended remote updates',
    'update-remote': 'This flag will indicate that after the lighthouse run is performed, the script should update the remote repo with the metrics gathered on a report',
    benchmark: 'Benchmark mode, it will perform a full lighthouse run and compare against a given rmeote HEAD',
  })
// set aliases
  .alias({ 'local-run': 'L' })

// boolean values
  .boolean([
    'use-headless',
    'update-remote',
  ])
  .string('benchmark')

// default values
  .default('use-headless', true)
  .default('update-remote', false)
  .default('benchmark', 'origin/master')
  .check((argv) => {
    // Lighthouse Helper won't throw if we have a config file with an URL in it
    const hasConfigURL = argv.config && argv.config.url

    if (hasConfigURL) {
      return true
    } else if (argv._.length > 0) {
      return true
    }

    throw new Error('Please provide a url')
  })
  .epilogue(
    'For more information on Lighthouse Helper, see https://github.com/bubble-dev/_/tree/master/packages/lighthouse-helper.'
  )
  .wrap(y.terminalWidth())
  .argv

const {
  _: [baseURL],
  'use-headless': useHeadless,
  'local-run': isLocalRun,
  'update-remote': updateMaster,
  benchmark,
} = argv

const baseDir = __dirname.replace(/bin\/?$/g, '')

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJson = require(`${baseDir}/package.json`)
const PACKAGE_VERSION = packageJson.version

const reportFormat = useHeadless ? 'json' : 'html'

// TODO: Allow for user to provide perfRun setup in config file
const perfRun = {
  extends: 'lighthouse:default',
  settings: {
    ...defaultSettings,
    disableDeviceEmulation: true,
    emulatedFormFactor: 'desktop',
    throttlingMethod: 'devtools',
  },
  audits: [
    'user-timings',
    'critical-request-chains',
    'byte-efficiency/unused-javascript',
  ],
  passes: [
    {
      passName: 'extraPass',
      gatherers: [
        'js-usage',
      ],
    },
  ],
  categories: {
    performance: {
      name: 'Performance Metrics',
      description: 'These encapsulate your web app\'s performance.',
      auditRefs: [
        { id: 'unused-javascript', weight: 0, group: 'load-opportunities' },
      ],
    },
  },
}

const revHashPromise = executeWithMessage(undefined, 'git rev-list origin/master..HEAD')()
  .then(({ stdout: revlist }) => (revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0]))

function launchChromeAndRunLighthouse(url, opts, config = perfRun) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags, chromePath: puppetteer.executablePath() }).then((chrome) => {
    opts.port = chrome.port

    return lighthouse(url, opts, config).then((results) => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)

      if (benchmark) {
        return revHashPromise
          .then((hash) => {
            if (!isLocalRun && benchmark === 'origin/master' && hash === 'master') {
              log('running on master, benchmarking is skipped', yellow)

              // TODO: Pass config report folder when we coded that in
              return generateReportForHash(chrome, results, reportFormat)({ hash })
            }

            return executeWithMessage(undefined, `git rev-parse --verify ${benchmark}`)()
              .then(({ stdout: prevHash }) => {
                const folderName = benchmark === 'origin/master' ? 'master' : prevHash.replace('\n', '')
                // TODO: Make the reportFolder also overwritable by the config
                const prevDirName = getReportFolder(folderName)
                const reportFile = getReportPath(prevDirName, reportFormat)
                const regressionDigest = {}
                const improvementDigest = {}
                let measures = []
                let prevMeasures = []

                try {
                  // eslint-disable-next-line @typescript-eslint/no-require-imports
                  const prevReport = require(reportFile)

                  const { lhr: report } = results

                  if (report.audits['user-timings']) {
                    measures = report.audits['user-timings'].details.items.filter((timming) => timming.timingType.toLowerCase() === 'measure')
                    prevMeasures = prevReport.audits['user-timings'].details.items.filter((timming) => timming.timingType.toLowerCase() === 'measure')

                    for (const measure of measures) {
                      const prevMeasure = prevMeasures.find((prevM) => prevM.name === measure.name)

                      if (prevMeasure === undefined) {
                        const message = `${measure.name} was added as a new user timming!`
                        improvementDigest[measure.name] = {
                          improvement: `${measure.duration}ms`,
                          message,
                        }
                        log(message)
                      } else if (measure.duration > prevMeasure.duration) {
                        const regressionMessage = `${measure.name} user timming has regressed`
                        regressionDigest[measure.name] = {
                          regression: `${Math.floor(measure.duration - prevMeasure.duration)}ms`,
                          regressionMessage,
                        }
                        log(regressionMessage)
                      } else if (measure.duration < prevMeasure.duration) {
                        const message = `${measure.name} user timming has improved`
                        improvementDigest[measure.name] = {
                          improvement: `${Math.floor(prevMeasure.duration - measure.duration)}ms`,
                          message,
                        }
                        log(message)
                      }
                    }
                  }

                  // re-add the metrics on a for-loop reading from the utils
                } catch (err) {
                  error(err)
                }

                const reportFolder = getReportFolder(hash)

                return executeWithMessage(undefined, `yarn rimraf ${reportFolder} && mkdir ${reportFolder}`)()
                  .then(
                    () => generateDigests({ regressions: regressionDigest, improvements: improvementDigest }, hash)
                      .then(() => (
                        // TODO: Pass config report folder when we coded that in
                        generateReportForHash(chrome, results, reportFormat)({ hash })
                      ))
                  )
              })
          })
      }

      // TODO: Pass config report folder when we coded that in
      return revHashPromise.then((hash) => generateReportForHash(chrome, results, reportFormat)({ hash }))
    })
  })
}

// TODO: Allow output, extraHeaders and chrome flags to be overridable from the comming config.json
const opts = {
  chromeFlags: useHeadless
    ? [
      '--show-paint-rects',
      '--headless',
      '--ignore-certificate-errors',
    ]
    : ['--show-paint-rects', '--ignore-certificate-errors'],
  extraHeaders: { 'shipping-module-version': PACKAGE_VERSION },
  logLevel: 'info',
  output: [
    'json',
    'html',
  ],
}

lighthouseLogger.setLevel(opts.logLevel)

revHashPromise
  .then((hash) => {
    if (!isLocalRun && hash === 'master' && !updateMaster) {
      log('Skipping lighthouse report')

      return false
    }

    const lighthousePromise = launchChromeAndRunLighthouse(baseURL, opts)
      .then((result) => (
        useHeadless
          ? log(`Report saved to ${result}`, green)
          : chromeLauncher.launch({ startingUrl: `file:///${result}` })
      ))

    return isLocalRun
      ? lighthousePromise
      : lighthousePromise
        .then(() => {
          // TODO: get the report and push to the configured bucket/remote with a specific hash of the current branch

          return true
        })
  })
  .then(() => process.exit())
  .catch((err) => {
    error(err)
    process.exit(1)
  })
