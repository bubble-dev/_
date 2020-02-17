import { TBumpType } from './types'
import { compareReleaseTypes } from './compare-release-types'

export const compareMessageTypes = (a: TBumpType | null, b: TBumpType | null) => {
  if (a === b) {
    return 0
  }

  if (a === 'initial') {
    return 1
  }

  if (b === 'initial') {
    return -1
  }

  return compareReleaseTypes(a, b)
}
