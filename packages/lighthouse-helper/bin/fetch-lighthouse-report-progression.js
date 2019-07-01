/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs'
import https from 'https'
// import { resolve } from 'path'
import axios from 'axios'
import {
  log,
  error,
  executeWithMessage,
  config,
} from './utils'
import { getCredentialsFromArgv } from './utils/auth'

const credentials = getCredentialsFromArgv(process.argv)

const reportsFile = 'reports/automated-lighthouse-master/report.json'
const reportDigest = { data: [] }

const instance = axios.create({
  auth: credentials,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

const lighthouseStatsPath = 'lighthouse-stats'
// const folderPath = resolve(`${lighthouseStatsPath}/build`)

executeWithMessage('Fetching last 20 releases', `git log --format="%H | %ad" -20 -- ${reportsFile}`)()
  .then(async ({ stdout }) => {
    const { hashes, dates } = stdout.split('\n').reduce((acc, item) => {
      if (item === '') {
        return acc
      }

      const [hash, date] = item.split(' | ')
      acc.hashes.push(hash)
      acc.dates.push(date)

      return acc
    }, { hashes: [], dates: [] })

    for (const hash of hashes) {
      log(`Fetching report for hash ${hash}`)
      let totalModuleSizeInBytes = 0
      let assets = []
      const { data: report } = await instance.get(`${config.BITBUCKET_URL}/projects/${config.TEAM_PROJECT_NAME}/repos/${config.SHIPPING_MODULE_REPO_NAME}/raw/${reportsFile}?at=${hash}`)
      const { data: { version: currentVersion } } = await instance.get(`${config.BITBUCKET_URL}/projects/${config.TEAM_PROJECT_NAME}/repos/${config.SHIPPING_MODULE_REPO_NAME}/raw/package.json?at=${hash}`)

      try {
        const { data } = await instance.get(`${config.BITBUCKET_URL}/projects/${config.TEAM_PROJECT_NAME}/repos/${config.SHIPPING_MODULE_REPO_NAME}/raw/stats.json?at=${hash}`)
        assets = data.assets
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { data } = require('../lighthouse-stats/src/data.json')
        totalModuleSizeInBytes = data.find((item) => item.version === currentVersion).moduleWeight * 1000
      }

      for (const asset of assets) {
        if (!asset.name.includes('vendor')) {
          totalModuleSizeInBytes = asset.size + totalModuleSizeInBytes
        }
      }

      const measures = report.audits['user-timings'].details.items.filter((timming) => timming.timingType.toLowerCase() === 'measure')
        .reduce((acc, { name, duration }) => ({ ...acc, [name]: duration }), {})
      const { speedIndex } = report.audits['speed-index']
      const { mainThread } = report.audits['mainthread-work-breakdown']
      const [, totalWeight] = report.audits['total-byte-weight'].displayValue

      log(currentVersion)
      log(`TOTAL MODULE SIZE IN BYTES: ${totalModuleSizeInBytes}`)

      reportDigest.data.push({
        date: dates.shift(),
        'speed-index': speedIndex,
        'main-thread-work': mainThread,
        moduleWeight: (totalModuleSizeInBytes / 1000),
        'total-weight': totalWeight,
        version: currentVersion,
        ...measures,
      })
    }

    reportDigest.data.reverse() // for accurate timeline

    log('Saving digest to file')
    // eslint-disable-next-line no-sync
    fs.writeFileSync('lighthouse-stats/src/data.json', JSON.stringify(reportDigest, null, 2))
  })
  .then(executeWithMessage('Building stats page', `./bin/bootstrap.sh ${lighthouseStatsPath} https://s3.int.klarna.net/merchant-shipping/lighthouse-stats/`))
  .then(() => log('Uploading to amazong bucket'))
  // .then(() => uploadToS3(folderPath, 'lighthouse-stats'))
  .then(() => process.exit())
  .catch((err) => {
    error(err)
    process.exit(1)
  })
