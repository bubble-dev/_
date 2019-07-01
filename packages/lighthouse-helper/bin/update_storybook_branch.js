/* eslint-disable import/no-extraneous-dependencies */
import { green } from 'chalk'
import packageJson from '../package.json'
import {
  log,
  error,
  executeWithMessage,
} from './utils'

const PACKAGE_VERSION = packageJson.version

const shouldTag = process.argv.find((arg) => arg.indexOf('--tag-and-publish') !== -1)

const NOOP_MESSAGE = 'Nothing to commit'

let commandPromise = executeWithMessage(undefined, 'git fetch && git checkout -B master origin/master')()
  .then(executeWithMessage('Building storybook', 'yarn build-storybook'))
  .then(executeWithMessage(undefined, 'git reset --hard')) // remove any leftover from previous things
  .then(executeWithMessage('Switching to storybook branch', 'git fetch origin && git checkout -B storybook origin/storybook'))
  .then(executeWithMessage('Removing static folder', 'rm -rf static'))
  .then(executeWithMessage('Copying new storybook files', 'cp -R storybook-static/* ./'))
  .then(executeWithMessage('Removing storybook-static folder', 'rm -rf storybook-static'))

if (shouldTag) {
  commandPromise = commandPromise
    .then(executeWithMessage('Updating repository', `git add --all && git commit -m "STORY-1: Update static storybook to ${PACKAGE_VERSION}"`))
    .then(executeWithMessage('Tagging new storybook release', `git tag storybook-v${PACKAGE_VERSION}`))
} else {
  commandPromise = commandPromise
    .then(executeWithMessage(undefined, 'git status'))
    .then(({ stdout }) => {
      if (typeof stdout === 'string' && stdout.indexOf('Changes not staged for commit:') === -1) {
        log('No change detected on storybook build, bailing out')
        throw new Error(NOOP_MESSAGE)
      }
    })
    .then(executeWithMessage(undefined, 'git rev-parse --verify --short=12 origin/master'))
    .then(({ stdout: hash }) => executeWithMessage('Updating repository', `git add --all && git commit -m "STORY-1: Update static storybook with patch for ${hash}"`)())
}

commandPromise
  .then(executeWithMessage('Updating remote repo and returning to previous branch', 'git push --follow-tags && git push origin --tags && git checkout -'))
  .then(() => {
    log(`You just published a new version of storybook to https://stash.int.klarna.net/pages/SHIP/shipping-module-frontend/storybook-v${PACKAGE_VERSION}/browse/index.html`, green)
  })
  .then(() => process.exit())
  .catch((err) => {
    if (err.message && err.message === NOOP_MESSAGE) {
      process.exit()
    } else {
      error(err)
      process.exit(1)
    }
  })
