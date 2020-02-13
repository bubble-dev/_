import semver from 'semver'
import { TBumpType, TBumpConfig } from '@auto/utils'

export const bumpVersion = (version: string, type: TBumpType, config: Required<TBumpConfig>): string => {
  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  if (type === 'initial') {
    return coercedVersion.inc(config.initialType).version
  }

  if (type === 'major' && coercedVersion.major === 0) {
    return coercedVersion.inc(config.zeroBreakingChangeType).version
  }

  return coercedVersion.inc(type).version
}
