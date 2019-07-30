import { Reducer } from 'redux'
import { DeepReadonly } from 'utility-types'
import { isUndefined } from 'tsfn'
import { isLoadingStartAction, isLoadingEndAction, isErrorAction, isLoadListAction, isSaveAction } from '../actions'
import { TAction, TState } from '../types'
import { initialState } from '../store/initial-state'

export type TReducer<S extends {}> = (state: S, action: TAction<any>) => S

export const reducer: Reducer<DeepReadonly<TState>> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  if (isLoadingStartAction(action)) {
    return {
      ...state,
      isLoading: true,
    }
  }

  if (isLoadingEndAction(action)) {
    return {
      ...state,
      isLoading: false,
    }
  }

  if (isErrorAction(action)) {
    return {
      ...state,
      error: action.error,
    }
  }

  if (isLoadListAction(action)) {
    return {
      ...state,
      kind: action.payload.kind,
      files: action.payload.files,
    }
  }

  if (isSaveAction(action)) {
    return {
      ...state,
      isSaved: true,
    }
  }

  return state
}
