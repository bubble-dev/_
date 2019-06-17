import { TPackageJson } from '@auto/utils'
import { isUndefined } from 'tsfn'
import { TDepsEntries, TDepsObject } from '../types'
import { objectFromEntries } from './object-from-entries'

export const composeDependencies = (packageJson: TPackageJson, depsToAdd: TDepsEntries, depsToRemove: string[]): TDepsObject | undefined => {
  if (isUndefined(packageJson.dependencies)) {
    if (depsToAdd.length > 0) {
      return objectFromEntries(depsToAdd)
    }

    return
  }

  return objectFromEntries(
    Object.entries(packageJson.dependencies)
      .filter(([name]) => !depsToRemove.includes(name))
      .concat(depsToAdd)
  )
}
