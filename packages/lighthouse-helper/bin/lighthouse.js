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

const getValue = (reportData, key) => {
  return reportData.audits[key].numericValue || reportData.audits[key].rawValue
}

function launchChromeAndRunLighthouse(url, opts, config = perfRun) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags, chromePath: puppetteer.executablePath() }).then((chrome) => {
    opts.port = chrome.port

    return lighthouse(url, opts, config).then((results) => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      if (benchmark) {
        return executeWithMessage(undefined, 'git rev-list origin/master..HEAD')()
          .then(({ stdout: revlist }) => (revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0]))
          .then((currentBranch) => {
            if (!isLocalRun && benchmark === 'origin/master' && currentBranch === 'master') {
              log('running on master, benchmarking is skipped', yellow)

              return generateReportForHash(chrome, results, reportFormat)({ stdout: currentBranch })
            }

            return executeWithMessage(undefined, `git rev-parse --verify ${benchmark}`)()
              .then(({ stdout: prevHash }) => {
                const folderName = benchmark === 'origin/master' ? 'master' : prevHash.replace('\n', '')
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

                  if (report.audits['speed-index'].score !== null && prevReport.audits['speed-index'].score !== null) {
                    if (report.audits['speed-index'].score < prevReport.audits['speed-index'].score) {
                      const regressionMessage = 'This hash has regressed on speed index'
                      const currentValue = getValue(report, 'speed-index')
                      const prevValue = getValue(prevReport, 'speed-index')
                      regressionDigest['speed-index'] = {
                        regression: `${Math.floor((currentValue - prevValue))}ms`,
                        regressionMessage,
                      }
                    } else if (report.audits['speed-index'].score > prevReport.audits['speed-index'].score) {
                      const message = 'This hash has improved speed index'
                      const currentValue = getValue(report, 'speed-index')
                      const prevValue = getValue(prevReport, 'speed-index')
                      improvementDigest['speed-index'] = {
                        improvement: `${Math.floor((prevValue - currentValue))}ms`,
                        message,
                      }
                    }
                  } else if (report.audits['speed-index'].score !== null) {
                    const message = 'This hash no previous speed index to compare to, here is what we recorded on this run'
                    const currentValue = getValue(report, 'speed-index')
                    improvementDigest['speed-index'] = {
                      improvement: `${Math.floor((currentValue))}ms`,
                      message,
                    }
                  } else if (report.audits['speed-index'].score === null && prevReport.audits['speed-index'].score === null) {
                    const regressionMessage = 'No speed index recorded on previous or current run!'
                    regressionDigest['speed-index'] = {
                      regression: '⚠️',
                      regressionMessage,
                    }
                  }

                  if (report.audits['mainthread-work-breakdown'].score < prevReport.audits['mainthread-work-breakdown'].score) {
                    const regressionMessage = 'This hash is hogging more on the main thread than benchmark'
                    const currentValue = getValue(report, 'mainthread-work-breakdown')
                    const prevValue = getValue(prevReport, 'mainthread-work-breakdown')
                    regressionDigest['mainthread-work-breakdown'] = {
                      regression: `${Math.floor((currentValue - prevValue))}ms`,
                      regressionMessage,
                    }

                    error(`WARN: ${regressionMessage}`)
                  } else if (report.audits['mainthread-work-breakdown'].score > prevReport.audits['mainthread-work-breakdown'].score) {
                    const message = 'This hash has freed CPU workload compared to last release'
                    const currentValue = getValue(report, 'mainthread-work-breakdown')
                    const prevValue = getValue(prevReport, 'mainthread-work-breakdown')

                    improvementDigest['mainthread-work-breakdown'] = {
                      improvement: `${Math.floor(prevValue - currentValue)}ms`,
                      message,
                    }

                    log(`INFO: ${message}`, green)
                  }

                  if (report.audits['bootup-time'].score < prevReport.audits['bootup-time'].score) {
                    const regressionMessage = 'This hash is taking longer to parse JS than benchmark'
                    const currentValue = getValue(report, 'mainthread-work-breakdown')
                    const prevValue = getValue(prevReport, 'mainthread-work-breakdown')

                    regressionDigest['bootup-time'] = {
                      regression: `${Math.floor((currentValue - prevValue))}ms`,
                      regressionMessage,
                    }

                    error(`WARN: ${regressionMessage}`)
                  } else if (report.audits['bootup-time'].score > prevReport.audits['bootup-time'].score) {
                    const message = 'JS parsing has improved since last version'
                    const currentValue = getValue(report, 'mainthread-work-breakdown')
                    const prevValue = getValue(prevReport, 'mainthread-work-breakdown')

                    improvementDigest['bootup-time'] = {
                      improvement: `${Math.floor((prevValue - currentValue))}ms`,
                      message,
                    }

                    log(`INFO: ${message}`, green)
                  }

                  if (report.audits['total-byte-weight'].score < prevReport.audits['total-byte-weight'].score) {
                    const difference = Math.floor(report.audits['total-byte-weight'].displayValue[1] - prevReport.audits['total-byte-weight'].displayValue[1])
                    const regressionMessage = `The total bytes sent is now bigger by ${difference}KB`

                    regressionDigest['total-byte-weight'] = {
                      regression: difference,
                      regressionMessage,
                    }

                    error(`WARN: ${regressionMessage}`)
                  } else if (report.audits['total-byte-weight'].score > prevReport.audits['total-byte-weight'].score) {
                    const difference = Math.floor(prevReport.audits['total-byte-weight'].displayValue[1] - prev.audits['total-byte-weight'].displayValue[1])
                    const message = `The total bytest sent is now smaller by ${difference}KB`
                    improvementDigest['total-byte-weight'] = {
                      improvement: `${difference}kb`,
                      message,
                    }

                    log(`INFO: ${message}`, green)
                  }

                  if (report.audits.deprecations.score === 0) {
                    const regressionMessage = 'This hash is using deprecated APIs'
                    regressionDigest.deprecations = {
                      regressionMessage,
                    }

                    error(`WARN: ${regressionMessage}`)
                  }
                } catch (err) {
                  error(err)
                }

                const reportFolder = getReportFolder(currentBranch)

                return executeWithMessage(undefined, `yarn rimraf ${reportFolder} && mkdir ${reportFolder}`)()
                  .then(
                    () => generateDigests({ regressions: regressionDigest, improvements: improvementDigest }, currentBranch)
                      .then(() => (
                        generateReportForHash(chrome, results, reportFormat)({ stdout: currentBranch })
                      ))
                  )
              })
          })
      }

      return executeWithMessage(undefined, 'git rev-list origin/master..HEAD')()
        .then(({ stdout: revlist }) => ({ stdout: revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0] }))
        .then(generateReportForHash(chrome, results, reportFormat))
    })
  })
}

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

executeWithMessage('Starting lighthouse report', 'git rev-list origin/master..HEAD')()
  .then(({ stdout: revlist }) => (revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0]))
  .then((hash) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { config } = require('./utils')

    if (!isLocalRun && hash === 'master' && !updateMaster) {
      log('Skipping lighthouse report on master merge')

      return true
    }

    const lighthousePromise = launchChromeAndRunLighthouse(
      baseURL === ''
        ? `${config.BITBUCKET_URL}/pages/${config.TEAM_PROJECT_NAME}/${config.LIGHTHOUSE_APP_REPO_NAME}/${hash.replace('\n', '')}/browse/lightouse-base-app/build/index.html`
        : baseURL,
      opts
    )
      .then((result) => (
        useHeadless
          ? log(`Report saved to ${result}`, green)
          : chromeLauncher.launch({ startingUrl: `file:///${result}` })
      ))

    return isLocalRun
      ? lighthousePromise
      : lighthousePromise
        .then(() => {
          if (hash !== 'master') {
            return executeWithMessage('Switching to lighthouse-branch branch', `git fetch --all && git checkout -B lighthouse-base lighthouse-base/${hash}`)()
              .then(executeWithMessage('Sending report to lighthouse-base-app remote', `git add reports/* && git commit -m "Report files for ${hash}" && git push lighthouse-base HEAD:${hash}`))
              .then(executeWithMessage(undefined, 'git checkout -'))
          }

          return true
        })
        .then(() => {
          if (updateMaster) {
            return executeWithMessage(undefined, 'yarn build')()
              .then(executeWithMessage('Generating webpack stats', 'yarn generate-stats'))
              .then(executeWithMessage('Updating master report file', 'git add . && git commit -m "RELEASE: Update lighthouse report and webpack stats 🤖" && git push origin HEAD:master'))
          }

          log('Not on master, skipping commit of report')

          return true
        })
  })
  .then(() => process.exit())
  .catch((err) => {
    error(err)
    process.exit(1)
  })
