import semver from 'semver'
import { TBumpType, TBumpConfig } from '@auto/utils'
import { bumpVersion } from './bump-version'

export const bumpRange = (range: string, version: string, type: TBumpType, config: Required<TBumpConfig>): string => {
  if (/[<>=|]/.test(range)) {
    throw new Error(`range '${range}' is not supported`)
  }

  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  const matches = range.match(/^([\^~])?.+$/)

  if (matches === null) {
    throw new Error(`range ${range} is not supported`)
  }

  const symb = matches[1]
  const newVersion = bumpVersion(version, type, config)

  if (typeof symb === 'undefined') {
    return newVersion
  }

  if (type === 'initial') {
    return `${symb}${newVersion}`
  }

  if (semver.satisfies(newVersion, range)) {
    if (!config.shouldAlwaysBumpDependents) {
      return range
    }

    return `${symb}${newVersion}`
  }

  return `^${newVersion}`
}
