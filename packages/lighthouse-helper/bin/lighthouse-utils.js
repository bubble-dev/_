/* eslint-disable no-nested-ternary */
const fs = require('fs')
const { error, log } = require('./utils')
const { green } = require('chalk')

const baseDir = __dirname.replace(/bin\/?$/g, '')

const metricsTypes = {
  generic: {
    regressionMessage: 'Metric $1 has regressed',
    improvementMessage: 'Metric $1 has improved',
    noPrevValue: 'This hash no previous $1 to compare to, here is what was recorded on this run',
    noRecordFound: 'No $1 recorded on previous or current run!',
    unit: '',
  },
  'speed-index': {
    regressionMessage: 'This hash has regressed on speed index',
    improvementMessage: 'This hash has improved speed index',
    unit: 'ms',
  },
  'mainthread-work-breakdown': {
    regressionMessage: 'This hash is hogging more on the main thread than benchmark',
    improvementMessage: 'This hash has freed CPU workload compared to last release',
    unit: 'ms',
  },
  'bootup-time': {
    regressionMessage: 'This hash is taking longer to parse JS than benchmark',
    improvementMessage: 'JS parsing has improved since last version',
    unit: 'ms',
  },
  'total-byte-weight': {
    regressionMessage: 'The total bytes sent is now bigger',
    improvementMessage: 'The total bytest sent is now smaller',
    unit: 'bytes',
  },
}

const defaultMetrics = [
  'speed-index',
  'mainthread-work-breakdown',
  'bootup-time',
  'total-byte-weight',
]

const getValue = (reportData, key) => {
  return reportData
    ? (reportData.audits[key].numericValue || reportData.audits[key].rawValue)
    : null
}

const getGenericMessages = (metric) => {
  return Object.keys(metricsTypes.generic).reduce((acc, curr) => {
    acc[curr] = metricsTypes.generic[curr].replace('$1', metric)

    return acc
  }, {})
}

const getMetricStats = (report, prevReport, metrics = defaultMetrics) => {
  const regressions = {}
  const improvements = {}

  // Automatically check and track user-timings
  if (report.audits['user-timings']) {
    let measures = []
    let prevMeasures = []

    measures = report.audits['user-timings'].details.items.filter((timming) => timming.timingType.toLowerCase() === 'measure')
    prevMeasures = prevReport
      ? prevReport.audits['user-timings'].details.items.filter((timming) => timming.timingType.toLowerCase() === 'measure')
      : []

    for (const measure of measures) {
      const prevMeasure = prevMeasures.find((prevM) => prevM.name === measure.name)

      if (prevMeasure === undefined) {
        const message = `${measure.name} was added as a new user timming!`
        improvements[measure.name] = {
          improvement: `${measure.duration}ms`,
          message,
        }
        log(message)
      } else if (measure.duration > prevMeasure.duration) {
        const regressionMessage = `${measure.name} user timming has regressed`
        regressions[measure.name] = {
          regression: `${Math.floor(measure.duration - prevMeasure.duration)}ms`,
          regressionMessage,
        }
        log(regressionMessage)
      } else if (measure.duration < prevMeasure.duration) {
        const message = `${measure.name} user timming has improved`
        improvements[measure.name] = {
          improvement: `${Math.floor(prevMeasure.duration - measure.duration)}ms`,
          message,
        }
        log(message)
      }
    }
  }

  // walk through the metrics and collect data
  if (metrics && metrics.length) {
    metrics.forEach((metric) => {
      const metricDef = metricsTypes[metric]
      const genericDef = getGenericMessages(metric)

      // create an object with good defaults if current metric has no definition
      const metricMessages = { ...genericDef, ...metricDef }
      const prevScore = prevReport ? prevReport.audits[metric].score : null
      const currentScore = report.audits[metric].score

      if (currentScore !== null && prevScore !== null) {
        if (currentScore < prevScore) {
          const regressionMessage = metricMessages.regressionMessage
          const currentValue = getValue(report, metric)
          const prevValue = getValue(prevReport, metric)
          regressions[metric] = {
            regression: `${Math.floor((currentValue - prevValue))} ${metricMessages.unit}`,
            regressionMessage,
          }

          error(`WARN: ${regressionMessage}`)
        } else if (currentScore > prevScore) {
          const message = metricMessages.improvementMessage
          const currentValue = getValue(report, metric)
          const prevValue = getValue(prevReport, metric)
          improvements[metric] = {
            improvement: `${Math.floor((prevValue - currentValue))} ${metricMessages.unit}`,
            message,
          }

          log(`INFO: ${message}`, green)
        }
      } else if (currentScore !== null) {
        const message = metricMessages.noPrevValue
        const currentValue = getValue(report, metric)
        improvements[metric] = {
          improvement: `${Math.floor((currentValue))} ${metricMessages.unit}`,
          message,
        }

        log(`INFO: ${message}`, green)
      } else if (currentScore === null && prevScore === null) {
        const regressionMessage = metricMessages.noRecordFound
        regressions[metric] = {
          regression: '⚠️',
          regressionMessage,
        }

        error(`WARN: ${regressionMessage}`)
      }
    })
  }

  return { regressions, improvements }
}

const getReportFolder = (hash) => `${baseDir}reports/automated-lighthouse-${hash}`.replace('\n', '')

const getReportPath = (dirName, format, fileName = 'report') => `${dirName}/${fileName}.${format}`

/**
 * Function that will generate the report based on the results for the lighthouse run
 * @param LaunchedChrome chrome The Chrome instance
 * @param { report: object | string | array, lhr: object } results For multi format run on lighthnouse it will be an array with both formats
 * @param string reportFormat the format informed by the CLI command
 * @param string reportFolder the desired folder destination to save the generated reports
 */
const generateReportForHash = (chrome, results, reportFormat, reportFolder) => ({ hash, fileName }) => {
  const dirName = reportFolder || getReportFolder(hash.replace('\n', ''))
  const reportFile = getReportPath(dirName, reportFormat, fileName)
  let JSON = results.report
  let HTML

  if (Array.isArray(results.report)) {
    [JSON, HTML] = results.report
  }

  try {
    // eslint-disable-next-line no-sync
    fs.writeFileSync(reportFile, JSON)

    if (HTML) {
      // eslint-disable-next-line no-sync
      fs.writeFileSync(reportFile.replace('.json', '.html'), HTML)
    }
  } catch (err) {
    error(err)
    process.exit(1)
  }

  return chrome ? chrome.kill().then(() => reportFile) : Promise.resolve(reportFile)
}

/**
 * Utility function to generate the digests
 * @typedef improvements { [metricName: string]: { improvement: number | string, message: string | undefined }
 * @typedef regressions { [metricName: string]: { regression: number | string, message: string | undefined, infoMessage: string | undefined }
 * @param { regressions: regressions, improvements: improvements }} digest
 * @param string hash
 */
function generateDigests(digest, hash) {
  const digests = Object.keys(digest)

  return Promise.all(digests.map((digestName) => {
    // if there's nothing on the digest, do not create a digest file
    if (Object.keys(digest[digestName]).length === 0) {
      return Promise.resolve(true)
    }

    return generateReportForHash(undefined, { report: JSON.stringify(digest[digestName], null, 2) }, 'json')({ hash, fileName: `${digestName}-digest` })
  }))
}

module.exports = {
  getReportFolder,
  getReportPath,
  generateReportForHash,
  generateDigests,
  getValue,
  getMetricStats,
}