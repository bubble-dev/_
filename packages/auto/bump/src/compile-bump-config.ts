import { TBumpConfig, TResolvedBumpType } from '@auto/utils'

export const bumpTypes: TResolvedBumpType[] = ['patch', 'minor', 'major']

const defaultAutoConfig: Required<TBumpConfig> = {
  initialType: 'minor',
  zeroBreakingChangeType: 'minor',
  shouldAlwaysBumpDependents: false,
}

export const compileBumpConfig = (rootConfig?: TBumpConfig, packageConfig?: TBumpConfig): Required<TBumpConfig> => {
  const result: Required<TBumpConfig> = {
    ...defaultAutoConfig,
    ...rootConfig,
    ...packageConfig,
  }

  if (!bumpTypes.includes(result.initialType)) {
    throw new Error('Incorrect initialType in config')
  }

  if (!bumpTypes.includes(result.zeroBreakingChangeType)) {
    throw new Error('Incorrect zeroBreakingChangeType in config')
  }

  return result
}
