import { isUndefined } from 'tsfn'
import { TPackageJson } from './types'
import { uniqueArray } from './unique-array'

export const getDevDepsToAdd = (packageJson: TPackageJson, depNames: string[], ignoredPackages: string[]): string[] => {
  const dependenciesKeys = !isUndefined(packageJson.dependencies)
    ? Object.keys(packageJson.dependencies)
    : []
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []
  const peerDependenciesKeys = !isUndefined(packageJson.peerDependencies)
    ? Object.keys(packageJson.peerDependencies)
    : []
  const mergedNames = uniqueArray([
    ...depNames,
    ...peerDependenciesKeys,
  ])

  return mergedNames.filter((name) => (
    !ignoredPackages.includes(name) &&
    !dependenciesKeys.includes(name) &&
    !devDependenciesKeys.includes(name)
  ))
}
