/* eslint-disable no-console, import/no-extraneous-dependencies */
import util from 'util'
import { exec as baseExec } from 'child_process'
import { cyan, red, white } from 'chalk'

const exec = util.promisify(baseExec)

export const log = (message, color = cyan) => console.log('\n', color(message))
export const error = (message) => console.error('\n', red(message))

export const executeWithMessage = (message, command) => async () => {
  if (message && message !== '') {
    log(message)
  }

  const { stdout, stderr } = await exec(command)
  log(stdout, white.dim)
  log(stderr, white.dim)

  return { stdout, stderr }
}

// TODO: Make this part of the lighthouse.config.js
export const config = {
  BITBUCKET_URL: '',
  TEAM_PROJECT_NAME: '',
  LIGHTHOUSE_APP_REPO_NAME: 'lighthouse-base-app',
  SHIPPING_MODULE_REPO_NAME: 'shipping-module-frontend',
}
