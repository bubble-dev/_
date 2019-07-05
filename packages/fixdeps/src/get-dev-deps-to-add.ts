import { TPackageJson } from '@auto/utils'
import { isUndefined } from 'tsfn'

export const getDevDepsToAdd = (packageJson: TPackageJson, depNames: string[], ignoredPackages: string[]): string[] => {
  const dependenciesKeys = !isUndefined(packageJson.dependencies)
    ? Object.keys(packageJson.dependencies)
    : []
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []

  return depNames.filter((name) => (
    !ignoredPackages.includes(name) &&
    !dependenciesKeys.includes(name) &&
    !devDependenciesKeys.includes(name)
  ))
}
