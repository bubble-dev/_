import { TBumpType, TBumpConfig, TResolvedBumpType } from '@auto/utils'

export const resolveBumpType = (type: TBumpType, config: Required<TBumpConfig>): TResolvedBumpType => {
  if (type === 'initial') {
    return config.initialType
  }

  return type
}
