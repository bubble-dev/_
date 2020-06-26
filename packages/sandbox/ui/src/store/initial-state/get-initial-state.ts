import { getCurrentHash, decodeUrl } from '../utils'
import { TState } from '../types'
import { initialState } from './initial-state'

export const getInitialState = (): TState => {
  const hash = getCurrentHash()

  if (hash !== null) {
    return decodeUrl(hash) as TState
  }

  return initialState
}
