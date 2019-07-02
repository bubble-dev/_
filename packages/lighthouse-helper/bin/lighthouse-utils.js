/* eslint-disable no-nested-ternary */
const fs = require('fs')
const { error } = require('./utils')

const baseDir = __dirname.replace(/bin\/?$/g, '')

const getReportFolder = (hash) => `${baseDir}reports/automated-lighthouse-${hash}`.replace('\n', '')

const getReportPath = (dirName, format, fileName = 'report') => `${dirName}/${fileName}.${format}`

/**
 * Function that will generate the report based on the results for the lighthouse run
 * @param LaunchedChrome chrome The Chrome instance
 * @param { report: object | string | array, lhr: object } results For multi format run on lighthnouse it will be an array with both formats
 * @param string reportFormat the format informed by the CLI command
 */
const generateReportForHash = (chrome, results, reportFormat) => ({ stdout: hash, fileName }) => {
  const dirName = getReportFolder(hash.replace('\n', ''))
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
}
