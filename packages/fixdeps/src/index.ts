import path from 'path'
import { promisify } from 'util'
import { readFile, writeFile } from 'graceful-fs'
import fastGlob from 'fast-glob'
import { TOptions } from './types'
import { uniqueArray } from './unique-array'
import { globalIgnoreList } from './global-ignore-list'
import { getDependenciesInContent } from './get-dependencies-in-content'
import { getDepsToRemove } from './get-deps-to-remove'
import { getDepsToAdd } from './get-deps-to-add'
import { getDevDepsToAdd } from './get-dev-deps-to-add'
import { getDepsVersions } from './get-deps-versions'
import { composeDependencies } from './compose-dependencies'
import { getPackage } from './get-package-json'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export const fixdeps = async ({
  packagePath,
  ignoredPackages,
  dependencyFilesGlobs,
  devDependencyFilesGlobs,
}: TOptions) => {
  const fastGlobOptions = {
    ignore: ['node_modules/**'],
    deep: 0,
    onlyFiles: false,
    expandDirectories: false,
    absolute: true,
  }

  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = await getPackage(packagePath)
  const dependencyFiles = await fastGlob(
    dependencyFilesGlobs.map((glob) => `${packagePath}/${glob}`),
    fastGlobOptions
  )
  const devDependencyFiles = await fastGlob(
    devDependencyFilesGlobs.map((glob) => `${packagePath}/${glob}`),
    fastGlobOptions
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
      } else /* if (devDependencyFiles.includes(filename)) */ {
        devDependencyList.push(dep)
      }
    })
  }

  const depsToRemove = getDepsToRemove(packageJson, [...dependencyList, ...devDependencyList], allIgnoredPackages)
  const depsToAdd = getDepsToAdd(packageJson, dependencyList, allIgnoredPackages)
  const devDepsToAdd = getDevDepsToAdd(packageJson, devDependencyList, allIgnoredPackages)

  const depsToAddWithVersions = await getDepsVersions(depsToAdd)
  const devDepsToAddWithVersions = await getDepsVersions(devDepsToAdd)

  const composedDependencies = composeDependencies(packageJson.dependencies, depsToAddWithVersions, depsToRemove)
  const composedDevDependencies = composeDependencies(packageJson.devDependencies, devDepsToAddWithVersions, depsToRemove)

  if (Object.keys(composedDependencies).length > 0) {
    packageJson.dependencies = composedDependencies
  } else {
    Reflect.deleteProperty(packageJson, 'dependencies')
  }

  if (Object.keys(composedDevDependencies).length > 0) {
    packageJson.devDependencies = composedDevDependencies
  } else {
    Reflect.deleteProperty(packageJson, 'devDependencies')
  }

  if (depsToRemove.length > 0 || depsToAddWithVersions.length > 0) {
    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await pWriteFile(packageJsonPath, packageData)
  }
}
