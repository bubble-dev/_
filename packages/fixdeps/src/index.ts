import path from 'path'
import { promisify } from 'util'
import { getPackage } from '@auto/fs'
import { readFile, writeFile } from 'graceful-fs'
import globby from 'globby'
import { TOptions } from './types'
import { uniqueArray } from './unique-array'
import { globalIgnoreList } from './global-ignore-list'
import { getDependenciesInContent } from './get-dependencies-in-content'
import { getDepsToRemove } from './get-deps-to-remove'
import { getDepsToAdd } from './get-deps-to-add'
import { getDevDepsToAdd } from './get-dev-deps-to-add'
import { getDepsVersions } from './get-deps-versions'
import { composeDependencies } from './compose-dependencies'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export const fixdeps = async ({
  packagePath,
  ignoredPackages,
  dependencyFilesGlobs,
  devDependencyFilesGlobs,
}: TOptions) => {
  const globbyOptions = {
    ignore: ['node_modules/**'],
    deep: true,
    onlyFiles: false,
    expandDirectories: false,
    absolute: true,
  }

  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = await getPackage(packagePath)
  const dependencyFiles = await globby(
    dependencyFilesGlobs.map((glob) => `${packagePath}/${glob}`),
    globbyOptions
  )
  const devDependencyFiles = await globby(
    devDependencyFilesGlobs.map((glob) => `${packagePath}/${glob}`),
    globbyOptions
  )
  const allFiles = uniqueArray([...dependencyFiles, ...devDependencyFiles])
  const allIgnoredPackages = Array.isArray(ignoredPackages)
    ? globalIgnoreList.concat(ignoredPackages)
    : globalIgnoreList

  const dependencyList: string[] = []
  const devDependencyList: string[] = []

  for (const filename of allFiles) {
    const fileContent = await pReadFile(filename, 'utf8')

    getDependenciesInContent(fileContent).forEach((dep) => {
      if (dependencyFiles.includes(filename)) {
        dependencyList.push(dep)
      } else if (devDependencyFiles.includes(filename)) {
        devDependencyList.push(dep)
      }
    })
  }

  const depsToRemove = getDepsToRemove(packageJson, dependencyList, allIgnoredPackages)
  const devDepsToRemove = getDepsToRemove(packageJson, devDependencyList, allIgnoredPackages)
  const depsToAdd = getDepsToAdd(packageJson, dependencyList, allIgnoredPackages)
  const devDepsToAdd = getDevDepsToAdd(packageJson, devDependencyList, allIgnoredPackages)

  const depsToAddWithVersions = await getDepsVersions(depsToAdd)
  const devDepsToAddWithVersions = await getDepsVersions(devDepsToAdd)

  packageJson.dependencies = composeDependencies(packageJson.dependencies, depsToAddWithVersions, depsToRemove)
  packageJson.devDependencies = composeDependencies(packageJson.devDependencies, devDepsToAddWithVersions, devDepsToRemove)

  if (devDepsToRemove.length > 0 || depsToAddWithVersions.length > 0) {
    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await pWriteFile(packageJsonPath, packageData)
  }
}
