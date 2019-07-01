/* eslint-disable import/no-extraneous-dependencies, import/no-dynamic-require */
import https from 'https'
import { green, cyan } from 'chalk'
import axios from 'axios'
import {
  log,
  error,
  executeWithMessage,
  config,
} from './utils'
import { getCredentialsFromArgv } from './utils/auth'

const credentials = getCredentialsFromArgv(process.argv)

executeWithMessage(undefined, 'git rev-list origin/master..HEAD')()
  .then(({ stdout: revlist }) => (revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0]))
  .then((hash) => {
    if (hash === 'master') {
      return process.exit()
    }

    const instance = axios.create({
      auth: credentials,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })

    return instance.get(
      `${config.BITBUCKET_URL}/rest/api/latest/projects/${config.TEAM_PROJECT_NAME}/repos/${config.SHIPPING_MODULE_REPO_NAME}/pull-requests?order=newest&state=OPEN&start=0`
    ).then(async ({ data: { values } }) => {
      const commitHash = hash.replace('\n', '')
      const prForBranch = values.find(({ fromRef: { latestCommit } }) => (latestCommit === commitHash))

      if (!prForBranch) {
        log('No PR found for current HEAD, skip updating PR')

        return false
      }

      let text = '## Lighthouse report for PR 🌟'

      try {
        const { data: digest } = await instance.get(`${config.BITBUCKET_URL}/pages/${config.TEAM_PROJECT_NAME}/${config.LIGHTHOUSE_APP_REPO_NAME}/${commitHash}/browse/reports/automated-lighthouse-${commitHash}/regressions-digest.json`)

        text = Object.keys(digest).reduce((message, regression) => (
          `${message}\n| ${regression}   | ${digest[regression].regression || '🌩'}   | ${digest[regression].regressionMessage || '🌩'}   | ${digest[regression].infoMessage || '🌩'}   |`
        ), `${text}\n\n### Regressions found for PR 🌦\n| Lighthouse Metric     | Regression    | Message    | Extra info    |\n| --------|--------|--------|--------|`)
      } catch (_) {
        log('INFO: No regression found to report', cyan)
        text = `${text}\n\nNo regression found! ☀️`
      }

      try {
        const { data: digest } = await instance.get(`${config.BITBUCKET_URL}/pages/${config.TEAM_PROJECT_NAME}/${config.LIGHTHOUSE_APP_REPO_NAME}/${commitHash}/browse/reports/automated-lighthouse-${commitHash}/improvements-digest.json`)

        text = Object.keys(digest).reduce((message, improvement) => (
          `${message}\n| ${improvement}   | ${digest[improvement].improvement || '☀️'}   | ${digest[improvement].message || '☀️'}   |`
        ), `${text}\n\n### Improvements found for PR 🎉\n| Lighthouse Metric     | Improvement    | Message    |\n| --------|--------|--------|--------|`)
      } catch (_) {
        log('INFO: No improvement found to report', cyan)
        text = `${text}\n\nNo improvement found 👀`
      }

      text = `${text}\n\n**View full HTML report for the hash: [👉 🔗 ${commitHash}](${config.BITBUCKET_URL}/pages/${config.TEAM_PROJECT_NAME}/${config.LIGHTHOUSE_APP_REPO_NAME}/${commitHash}/browse/reports/automated-lighthouse-${commitHash}/report.html)**`

      return instance.post(
        `${config.BITBUCKET_URL}/rest/api/latest/projects/${config.TEAM_PROJECT_NAME}/repos/${config.SHIPPING_MODULE_REPO_NAME}/pull-requests/${prForBranch.id}/comments`,
        { text }
      )
    })
      .then((result) => (result === false ? log('No PR updated') : log('PR updated', green)))
      .then(() => process.exit())
      .catch((err) => {
        error(err)
        process.exit(1)
      })
  })
