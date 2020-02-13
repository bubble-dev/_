import path from 'path'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import copy from '@start/plugin-copy'
import {
  makeCommit,
  buildBumpedPackages,
  getPackagesBumps,
  publishPrompt,
  writePackagesDependencies,
  writeDependenciesCommit,
  writePackageVersions,
  writePublishCommit,
  publishPackagesBumps,
  pushCommitsAndTags,
  writePublishTags,
  makeGithubReleases,
  sendSlackMessage,
  sendTelegramMessage,
  writeChangelogFiles,
} from '@auto/start-plugin'
import { TGithubOptions, TSlackOptions, TTelegramOptions } from '@auto/log'
import { TPackageJson, TNpmConfig } from '@auto/utils'
import runVerdaccio from './plugins/run-verdaccio'
import { removeYarnCache } from './plugins/remove-yarn-cache'
import buildPackageJson from './plugins/build-package-json'
import { buildPackage } from './build'
import { getStartOptions } from './utils'

export const preparePackage = (packageDir: string) => {
  const dir = path.join('packages', packageDir)

  return sequence(
    find(`${dir}/{readme,license}.md`),
    copy(`${dir}/build/`),
    buildPackageJson(dir)
  )
}

export const commit = async () => {
  const { prefixes } = await import('./config/auto')

  return makeCommit(prefixes)
}

export const publish = async () => {
  const { prefixes } = await import('./config/auto')
  const { auto: rootAutoConfig = {} }: TPackageJson = await import(path.resolve('package.json'))

  const {
    shouldMakeGitTags = false,
    shouldMakeGitHubReleases = false,
    shouldSendSlackMessage = false,
    shouldSendTelegramMessage = false,
    shouldWriteChangelogFiles = false,
  } = await getStartOptions()

  // @ts-ignore
  const githubOptions: TGithubOptions = {
    token: process.env.AUTO_GITHUB_TOKEN as string,
    username: process.env.AUTO_GITHUB_USERNAME as string,
    repo: process.env.AUTO_GITHUB_REPO as string,
  }
  const slackOptions: TSlackOptions = {
    token: process.env.AUTO_SLACK_TOKEN as string,
    channel: process.env.AUTO_SLACK_CHANNEL as string,
    username: process.env.AUTO_SLACK_USERNAME as string,
    iconEmoji: process.env.AUTO_SLACK_ICON_EMOJI as string,
    colors: {
      initial: process.env.AUTO_SLACK_COLOR_INITIAL as string,
      major: process.env.AUTO_SLACK_COLOR_MAJOR as string,
      minor: process.env.AUTO_SLACK_COLOR_MINOR as string,
      patch: process.env.AUTO_SLACK_COLOR_PATCH as string,
    },
  }
  const telegramOptions: TTelegramOptions = {
    token: process.env.AUTO_TELEGRAM_TOKEN as string,
    chatId: process.env.AUTO_TELEGRAM_CHAT_ID as string,
  }

  return sequence(
    getPackagesBumps(prefixes, rootAutoConfig.bump),
    publishPrompt(prefixes),
    buildBumpedPackages(buildPackage),
    writePackagesDependencies,
    writeDependenciesCommit(prefixes),
    writePackageVersions,
    shouldWriteChangelogFiles && writeChangelogFiles(prefixes),
    writePublishCommit(prefixes),
    shouldMakeGitTags && writePublishTags(),
    buildBumpedPackages(preparePackage),
    publishPackagesBumps(rootAutoConfig.npm),
    pushCommitsAndTags,
    shouldMakeGitHubReleases && makeGithubReleases(prefixes, githubOptions),
    shouldSendSlackMessage && sendSlackMessage(prefixes, slackOptions),
    shouldSendTelegramMessage && sendTelegramMessage(prefixes, telegramOptions)
  )
}

export const testPublish = async () => {
  const { auto: rootAutoConfig = {} }: TPackageJson = await import(path.resolve('package.json'))
  const { prefixes } = await import('./config/auto')
  const npmConfig: TNpmConfig = {
    ...rootAutoConfig.npm,
    registry: 'http://localhost:4873',
  }

  const verdaccioConfigPath = require.resolve('./config/verdaccio.yml')

  return sequence(
    getPackagesBumps(prefixes, rootAutoConfig.bump),
    publishPrompt(prefixes),
    buildBumpedPackages(buildPackage),
    writePackagesDependencies,
    writePackageVersions,
    buildBumpedPackages(preparePackage),
    runVerdaccio(verdaccioConfigPath),
    publishPackagesBumps(npmConfig),
    removeYarnCache
  )
}
