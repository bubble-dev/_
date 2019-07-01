/* eslint-disable import/no-extraneous-dependencies */
import { green } from 'chalk'
import { log, error, executeWithMessage } from './utils'

const targetDir = process.argv.find((arg) => arg.indexOf('dir=') !== -1)
  ? process.argv.find((arg) => arg.indexOf('dir=') !== -1).split('=')[1]
  : undefined

if (!targetDir) {
  throw new Error('You must provide a target folder with dir=targetFolder')
}

executeWithMessage(undefined, 'git rev-list origin/master..HEAD')()
  .then(({ stdout: revlist }) => (revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0]))
  .then((hash) => {
    let PUBLIC_URL = 'https://stash.int.klarna.net/pages/SHIP/lighthouse-base-app/master/browse/lightouse-base-app/build'

    if (hash !== 'master') {
      log('Running on a branch, changing the PUBLIC_URL for lighthouse build')
      PUBLIC_URL = `https://stash.int.klarna.net/pages/SHIP/lighthouse-base-app/${hash}/browse/lightouse-base-app/build`
    }

    return executeWithMessage(undefined, `./bin/bootstrap.sh ${targetDir} ${PUBLIC_URL}`)()
  })
  .then(() => log('Bootstrap successfull'))
  .then(executeWithMessage(undefined, 'git checkout HEAD -- yarn.lock && git checkout HEAD -- lightouse-base-app/yarn.lock && git stash push -u'))
  .then(executeWithMessage(undefined, 'git rev-list origin/master..HEAD'))
  .then(({ stdout: revlist }) => {
    const newBranchName = revlist.replace('\n', '') === '' ? 'master' : revlist.split('\n')[0]

    return executeWithMessage('Switching to lighthouse-branch branch', 'git fetch --all && git checkout -B lighthouse-base lighthouse-base/master')()
      .then(executeWithMessage(undefined, `rm -rf lightouse-base-app/build && git add . && git commit -am "Remove old build for ${newBranchName}"`))
      .then(executeWithMessage('Updating repository', `git stash pop && git add . && git commit -am "Update build for ${newBranchName}"`))
      .then(executeWithMessage('Updating repository', `git push -f lighthouse-base HEAD:${newBranchName}`))
      .then(executeWithMessage(undefined, 'git checkout -'))
      .then(() => log(`Lighthouse base app built for ${newBranchName}`, green))
  })
  .then(() => process.exit())
  .catch((err) => {
    error(err)
    process.exit(1)
  })
