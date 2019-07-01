/* eslint-disable no-restricted-syntax, no-await-in-loop */
import https from 'https'
import axios from 'axios'
import {
  error,
  executeWithMessage,
  config,
} from './utils'

const [username, password] = process.argv.find((arg) => arg.indexOf('auth=') !== -1)
  ? process.argv.find((arg) => arg.indexOf('auth=') !== -1).split('=')[1].split(':')
  : ''

executeWithMessage(undefined, 'git fetch --all')()
  .then(undefined, 'git checkout -B TMP origin/master')
  .then(async () => {
    const instance = axios.create({
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })

    const { data: { values } } = await instance.get(`${config.BITBUCKET_URL}/rest/api/latest/projects/${config.TEAM_PROJECT_NAME}/repos/${config.LIGHTHOUSE_APP_REPO_NAME}/branches?base=refs%2Fheads%2Fmaster&details=true&start=0&limit=200&orderBy=MODIFICATION&context=%7B%22withMessages%22%3Afalse%7D`)

    for (const branch of values) {
      if (branch.displayId !== 'master') {
        try {
          const { stdout } = await executeWithMessage(undefined, `git log --oneline --merges ${branch.displayId}..origin/master`)()

          if (stdout.length !== 0) {
            await executeWithMessage(undefined, `git push --delete lighthouse-base ${branch.displayId}`)()
          }
        } catch (_) {
          // if the git log fails means we could be checkign a hash that got replace by a rebase or push -f
          // either way it no longer represents a living git tree.
          await executeWithMessage(undefined, `git push --delete lighthouse-base ${branch.displayId}`)()
        }
      }
    }

    return true
  })
  .then(undefined, 'git checkout -')
  .catch((err) => {
    error(err)
    process.exit(1)
  })
