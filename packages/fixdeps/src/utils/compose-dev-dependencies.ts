import { TPackageJson } from '@auto/utils'
import { isUndefined } from 'tsfn'
import { TDepsObject } from '../types'
import { objectFromEntries } from './object-from-entries'

export const composeDevDependencies = (packageJson: TPackageJson, removedDepsNames: string[], addedDepsNames: string[]): TDepsObject | undefined => {
  if (isUndefined(packageJson.devDependencies)) {
    return
  }

  const dependenciesKeys = !isUndefined(packageJson.dependencies)
    ? Object.keys(packageJson.dependencies)
    : []
  const devDependenciesKeys = !isUndefined(packageJson.devDependencies)
    ? Object.keys(packageJson.devDependencies)
    : []
  const peerDependenciesKeys = !isUndefined(packageJson.peerDependencies)
    ? Object.keys(packageJson.peerDependencies)
    : []

  return objectFromEntries(
    Object.entries(packageJson.devDependencies)
      .filter(([name]) => {
        if (name.startsWith('@types/')) {
          const baseName = name.substr(7)

          /* remove @types for deleted package */
          if (removedDepsNames.includes(baseName)) {
            return false
          }

          /* leave @types for used packages */
          if (
            dependenciesKeys.includes(baseName) ||
            devDependenciesKeys.includes(baseName) ||
            peerDependenciesKeys.includes(baseName) ||
            addedDepsNames.includes(baseName)
          ) {
            return true
          }
        }

        /* remove if not included in removedDevDeps */
        return !removedDepsNames.includes(name)
      })
  )
}
