import { getHashState as getSyncHashState } from '../store-sync/get-hash-state'
import { isValidSyncState } from '../store-sync/is-valid-sync-state'
import { pickMetaSubState } from '../store-sync/get-initial-sync-state'
import { initialState } from './initial-state'
import { TMetaState } from './types'

export const getHashInitialState = (): TMetaState => {
  const stateObj = getSyncHashState()

  if (isValidSyncState(stateObj)) {
    return {
      ...initialState,
      ...pickMetaSubState(stateObj),
    }
  }

  return initialState
}
