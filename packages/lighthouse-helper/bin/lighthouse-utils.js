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

const getValue = (reportData, key) => {
  return reportData.audits[key].numericValue || reportData.audits[key].rawValue
}

const getGenericMessages = (metric) => {
  return Object.keys(metricsTypes.generic).reduce((acc, curr) => {
    acc[curr] = metricsTypes.generic[curr].replace('$1', metric)

    return acc
  }, {})
}

const getMetricStats = (report, prevReport) => {
  const regressionDigest = {}
  const improvementDigest = {}

  return (metric) => {
    const metricDef = metricsTypes[metric]
    const genericDef = getGenericMessages(metric)

    // create an object with good defaults if current metric has no definition
    const metricMessages = { ...genericDef, ...metricDef }

    if (report.audits[metric].score !== null && prevReport.audits[metric].score !== null) {
      if (report.audits[metric].score < prevReport.audits[metric].score) {
        const regressionMessage = metricMessages.regressionMessage
        const currentValue = getValue(report, metric)
        const prevValue = getValue(prevReport, metric)
        regressionDigest[metric] = {
          regression: `${Math.floor((currentValue - prevValue))} ${metricMessages.unit}`,
          regressionMessage,
        }

        error(`WARN: ${regressionMessage}`)
      } else if (report.audits[metric].score > prevReport.audits[metric].score) {
        const message = metricMessages.improvementMessage
        const currentValue = getValue(report, metric)
        const prevValue = getValue(prevReport, metric)
        improvementDigest[metric] = {
          improvement: `${Math.floor((prevValue - currentValue))} ${metricMessages.unit}`,
          message,
        }

        log(`INFO: ${message}`, green)
      }
    } else if (report.audits[metric].score !== null) {
      const message = metricMessages.noPrevValue
      const currentValue = getValue(report, metric)
      improvementDigest[metric] = {
        improvement: `${Math.floor((currentValue))} ${metricMessages.unit}`,
        message,
      }

      log(`INFO: ${message}`, green)
    } else if (report.audits[metric].score === null && prevReport.audits[metric].score === null) {
      const regressionMessage = metricMessages.noRecordFound
      regressionDigest[metric] = {
        regression: '⚠️',
        regressionMessage,
      }

      error(`WARN: ${regressionMessage}`)
    }
  }
}

const getReportFolder = (hash) => `${baseDir}reports/automated-lighthouse-${hash}`.replace('\n', '')

const getReportPath = (dirName, format, fileName = 'report') => `${dirName}/${fileName}.${format}`

/**
 * Function that will generate the report based on the results for the lighthouse run
 * @param LaunchedChrome chrome The Chrome instance
 * @param { report: object | string | array, lhr: object } results For multi format run on lighthnouse it will be an array with both formats
 * @param string reportFormat the format informed by the CLI command
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
 * @typedef ImprovementDigest { [metricName: string]: { improvement: number | string, message: string | undefined }
 * @typedef RegressionDigest { [metricName: string]: { regression: number | string, message: string | undefined, infoMessage: string | undefined }
 * @param { regressions: RegressionDigest, improvements: ImprovementDigest }} digest
 * @param string workingBranch
 */
function generateDigests(digest, workingBranch) {
  const digests = Object.keys(digest)

  return Promise.all(digests.map((digestName) => {
    // if there's nothing on the digest, do not create a digest file
    if (Object.keys(digest[digestName]).length === 0) {
      return Promise.resolve(true)
    }

    return generateReportForHash(undefined, { report: JSON.stringify(digest[digestName], null, 2) }, 'json')({ stdout: workingBranch, fileName: `${digestName}-digest` })
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
