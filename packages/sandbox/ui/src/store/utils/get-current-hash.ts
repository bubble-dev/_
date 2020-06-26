import { globalObject } from '../../utils/global-object'

export const EMPTY_HASH = ''

export const getCurrentHash = (): string => {
  return globalObject.location.hash.substr(1)
}
