import { TGitBump, TBumpType } from './types'
import { compareReleaseTypes } from './compare-release-types'

export const getCommonBumpType = (bump: TGitBump): TBumpType => {
  let result: TBumpType | null = null

  for (const message of bump.messages) {
    if (compareReleaseTypes(message.type, result) > 0) {
      result = message.type
    }
  }

  if (result === null) {
    throw new Error('Could not get common bump type')
  }

  return result
}
