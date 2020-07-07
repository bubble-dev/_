import path from 'path'
import { StartPlugin } from '@start/plugin'
import inputFiles from '@start/plugin-input-files'
import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import babel from '@start/plugin-lib-babel'
import rename from '@start/plugin-rename'
import write from '@start/plugin-write'
import remove from '@start/plugin-remove'
import copy from '@start/plugin-copy'
import parallel from '@start/plugin-parallel'
import typescriptGenerate from '@start/plugin-lib-typescript-generate'
import copyAssets from './plugins/copy-assets'

export { default as preparePackage } from './plugins/prepare-package'

export const buildAssets = async (dir: string) => {
  const packageJsonPath = path.resolve(dir, 'package.json')
  const { default: packageJson } = await import(packageJsonPath)

  return copyAssets(dir, packageJson.buildAssets)
}

export const buildWeb = async (dir: string): Promise<StartPlugin<{}, {}>> => {
  const { babelConfigWebBuild } = await import('@bubble-dev/babel-config')

  return sequence(
    find([
      `${dir}/src/**/*.{js,jsx,ts,tsx}`,
      `!${dir}/src/**/*.{native,ios,android}.{js,jsx,ts,tsx}`,
      `!${dir}/src/**/*.d.ts`,
    ]),
    read,
    babel(babelConfigWebBuild),
    rename((file) => file.replace(/\.(ts|tsx|jsx)$/, '.js')),
    write(`${dir}/build/web/`),
    find(`${dir}/src/**/*.json`),
    copy(`${dir}/build/web/`)
  )
}

export const buildReactNative = async (dir: string): Promise<StartPlugin<{}, {}>> => {
  const { babelConfigReactNativeBuild } = await import('@bubble-dev/babel-config')
  const { default: globby } = await import('globby')
  const allFiles = await globby(
    [
      `${dir}/src/**/*.{js,jsx,ts,tsx}`,
      `!${dir}/src/**/*.d.ts`,
    ],
    {
      ignore: ['node_modules/**'],
      deep: Infinity,
      onlyFiles: true,
    }
  )
  const extRegExp = /\.(js|jsx|ts|tsx)$/
  const nativeFiles = allFiles.filter((file) => {
    if (allFiles.includes(file.replace(extRegExp, '.native.$1'))) {
      return false
    }

    if (allFiles.includes(file.replace(extRegExp, '.ios.$1'))) {
      return false
    }

    if (allFiles.includes(file.replace(extRegExp, '.android.$1'))) {
      return false
    }

    return true
  })

  return inputFiles(
    sequence(
      read,
      babel(babelConfigReactNativeBuild),
      rename((file) => file.replace(/(\.native)?\.(ts|tsx|jsx)$/, '.js')),
      write(`${dir}/build/native/`),
      find(`${dir}/src/**/*.json`),
      copy(`${dir}/build/native/`)
    )
  )(...nativeFiles)
}

export const buildNode = async (dir: string): Promise<StartPlugin<{}, {}>> => {
  const { babelConfigNodeBuild } = await import('@bubble-dev/babel-config')

  return sequence(
    env({ BABEL_ENV: 'production' }),
    find([
      `${dir}/src/**/*.{js,jsx,ts,tsx}`,
      `!${dir}/src/**/*.{native,ios,android}.{js,jsx,ts,tsx}`,
      `!${dir}/src/**/*.d.ts`,
    ]),
    read,
    babel(babelConfigNodeBuild),
    rename((file) => file.replace(/\.(ts|tsx|jsx)$/, '.js')),
    write(`${dir}/build/node/`),
    find(`${dir}/src/**/*.json`),
    copy(`${dir}/build/node/`)
  )
}

export const buildTypes = (dir: string): StartPlugin<{}, {}> =>
  sequence(
    typescriptGenerate(`${dir}/src/`, `${dir}/build/types/`),
    find(`${dir}/src/**/*.d.ts`),
    copy(`${dir}/build/types/`)
  )

export const buildPackage = async (packageDir: string): Promise<StartPlugin<{}, {}>> => {
  const dir = path.join('packages', packageDir)
  const packageJsonPath = path.resolve(dir, 'package.json')
  const { default: packageJson } = await import(packageJsonPath)

  const tasks = []

  if (Reflect.has(packageJson, 'main') || Reflect.has(packageJson, 'bin')) {
    tasks.push('buildNode')
  }

  if (Reflect.has(packageJson, 'browser')) {
    tasks.push('buildWeb')
  }

  if (Reflect.has(packageJson, 'react-native')) {
    tasks.push('buildReactNative')
  }

  if (Reflect.has(packageJson, 'buildAssets')) {
    tasks.push('buildAssets')
  }

  if (Reflect.has(packageJson, 'buildTasks')) {
    tasks.push(...packageJson.buildTasks)
  }

  if (Reflect.has(packageJson, 'main') || Reflect.has(packageJson, 'browser') || Reflect.has(packageJson, 'react-native')) {
    tasks.push('buildTypes')
  }

  return sequence(
    env({ NODE_ENV: 'production' }),
    find(`${dir}/build/`),
    remove,
    parallel(tasks)(dir)
  )
}

export const build = async (...packageDirs: string[]): Promise<StartPlugin<{}, {}>> => {
  if (packageDirs.length > 0) {
    return sequence(
      // @ts-ignore
      ...packageDirs.map(buildPackage)
    )
  }

  const { default: prompts } = await import('prompts')
  const { getPackages } = await import('@auto/fs')
  const { suggestFilter, makeRegExp } = await import('./utils')

  const baseDir = path.resolve('packages')
  const packages = await getPackages()
  const choices = Object.keys(packages)
    .map((name) => ({
      title: name.replace(/^@/, ''),
      value: path.relative(baseDir, packages[name].dir),
    }))
  const packageNames: string[] = []

  while (true) {
    const { packageName } = await prompts({
      type: 'autocomplete',
      name: 'packageName',
      message: 'Type package name',
      limit: 20,
      choices: choices.filter((choice) => !packageNames.includes(choice.value)),
      suggest: suggestFilter(packageNames.length > 0 ? '(done)' : null),
    }) as { packageName?: string }

    if (typeof packageName === 'undefined') {
      throw new Error('Package name is required')
    }

    if (packageName === '-') {
      break
    }

    if (packageName === '*') {
      return sequence(
        // @ts-ignore
        ...choices.map(({ value }) => buildPackage(value))
      )
    }

    if (packageName.includes('*')) {
      const regExp = makeRegExp(packageName)
      const filteredpackages = choices
        .map(({ value }) => value)
        .filter((value) => regExp.test(value))

      packageNames.push(...filteredpackages)

      continue
    }

    packageNames.push(packageName)
  }

  return sequence(
    // @ts-ignore
    ...packageNames.map(buildPackage)
  )
}
