import { TPackageJson } from '@auto/utils'
import { isUndefined } from 'tsfn'
import { mergeArray } from './merge-array'

export const getDepsToRemove = (packageJson: TPackageJson, depsFoundInFiles: string[], ignoredDeps: string[]): string[] => {
  const dependenciesKeys = !isUndefined(packageJson.dependencies)
    ? Object.keys(packageJson.dependencies)
    : []
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []
  const allDepsKeys = mergeArray(dependenciesKeys, devDependenciesKeys)
  const removedDeps: string[] = []

  for (const name of allDepsKeys) {
    if (!ignoredDeps.includes(name) && !depsFoundInFiles.includes(name)) {
      removedDeps.push(name)
    }
  }

  return removedDeps
}
