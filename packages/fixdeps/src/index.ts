import path from 'path'
import { promisify } from 'util'
import { getWorkspacesPackageDirs, getPackage } from '@auto/fs'
import { readFile, writeFile } from 'graceful-fs'
import globby from 'globby'
import { TOptions } from './types'
import {
  getDepsToRemove,
  globalIgnoreList,
  getDepsVersions,
  getDepsToAdd,
  getDependenciesInContent,
  mergeArray,
  composeDependencies,
  composeDevDependencies,
} from './utils'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export const fixdeps = async (options: TOptions) => {
  const logPath = options.logPath || (() => {})
  const logMessage = options.logMessage || (() => {})

  const allPackagesDirs = await getWorkspacesPackageDirs()
  const packagesDirs = allPackagesDirs.filter(options.workspacePackagesFilter)
  const globbyOptions = {
    ignore: ['node_modules/**'],
    deep: true,
    onlyFiles: false,
    expandDirectories: false,
    absolute: true,
  }

  for (const dir of packagesDirs) {
    const packageJsonPath = path.join(dir, 'package.json')
    const packageJson = await getPackage(dir)
    const filenamesToAddFrom = await globby(`${dir}/src/**/*.{ts,tsx}`, globbyOptions)
    const filenamesToRemoveFrom = await globby(`${dir}/**/*.{ts,tsx}`, globbyOptions)
    const mergedFilenames = mergeArray(filenamesToAddFrom, filenamesToRemoveFrom)
    const ignoredPackages = Array.isArray(options.ignoredPackages)
      ? globalIgnoreList.concat(options.ignoredPackages)
      : globalIgnoreList

    const depsFromAddList: string[] = []
    const depsFromRemoveList: string[] = []

    logPath(dir)

    for (const filename of mergedFilenames) {
      const fileContent = await pReadFile(filename, { encoding: 'utf8' })

      try {
        getDependenciesInContent(fileContent).forEach((dep) => {
          if (!depsFromRemoveList.includes(dep)) {
            depsFromRemoveList.push(dep)
          }

          if (filenamesToAddFrom.includes(filename)) {
            depsFromAddList.push(dep)
          }
        })
      } catch (e) {
        logMessage(e)
      }
    }

    const depsToRemove = getDepsToRemove(packageJson, depsFromRemoveList, ignoredPackages)
    const depsToAdd = getDepsToAdd(packageJson, depsFromAddList, ignoredPackages)
    const depsVersions = await getDepsVersions(depsToAdd, logMessage)

    packageJson.dependencies = composeDependencies(packageJson, depsVersions, depsToRemove)
    packageJson.devDependencies = composeDevDependencies(packageJson, depsToRemove, depsToAdd)

    if (depsToRemove.length > 0 || depsVersions.length > 0) {
      const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

      await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
    }
  }
}
