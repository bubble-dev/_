/* eslint-disable import/no-extraneous-dependencies */
import { green, yellow } from 'chalk'
import {
  log,
  error,
  executeWithMessage,
} from './utils'

const majorType = process.argv.find((arg) => arg === '--major')
const minorType = process.argv.find((arg) => arg === '--minor')
const patchType = process.argv.find((arg) => arg === '--patch')

const isRc = typeof process.argv.find((arg) => arg === '--rc') !== 'undefined'
const preReleasesType = {
  major: 'premajor',
  minor: 'preminor',
  patch: 'prepatch',
}

const jointParams = `(${majorType})(${minorType})(${patchType})`
const paramCheck = jointParams.match(/undefined/g)

if (!isRc && (paramCheck != null && (paramCheck.length < 2 || paramCheck.length === 3))) {
  throw new Error(error('You can only release with one of these options: --major|minor|patch; combine one of those with --rc for pre-releases; or just --rc for bumping a prerelease.'))
}

let versionType = jointParams.replace(/(\(|\)|undefined|--)+/g, '')

if (isRc) {
  // for eitgher premajor, preminor, prepatch or fallback for prerelease for bumpign a previous RC version
  versionType = preReleasesType[versionType] || 'prerelease'
}

const updateMaster = typeof process.argv.find((arg) => arg === '--update-master') !== 'undefined'

let commandPromise = executeWithMessage(`Tagging the release as a ${versionType} version`, `npm version ${versionType} -m "RELEASE: v%s 🚚 📦"`)()

// This should only be passed in by the automated script. So if you are reading this script, please don't use it 🙃
if (updateMaster) {
  commandPromise = commandPromise.then(executeWithMessage('Updating git origin/master', 'git push origin HEAD:master'))
} else {
  log('📦  Hello human! You chose to release from your machine instead of the automated script. 📦', yellow)
  log('🚢  You still will have a "RELEASE: ..." commit on your current git HEAD tough. 🚢', yellow)
  log('🤖  Be a nice human and create/update a PR with this change. Thanks! 🤖', yellow)
  log('👾  Worry not with the new tag created by npm, for it will be push to origin 👾', yellow)
}

commandPromise.then(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { version } = require('../package.json')

  return executeWithMessage(`Pushing new git tag v${version}`, `git push origin refs/tags/v${version}:refs/tags/v${version}`)()
}).then(executeWithMessage('Bundling new NPM release', 'yarn build'))
  .then(executeWithMessage('Publishing release to registry', 'npm publish'))
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { name, version } = require('../package.json')
    log(`🎉 You have successfully published ${name}@${version} 🎉`, green)
    process.exit()
  })
  .catch((err) => {
    error(err)
    process.exit(1)
  })
