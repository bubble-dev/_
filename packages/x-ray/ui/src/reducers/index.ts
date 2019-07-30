import { Reducer } from 'redux'
import { DeepReadonly } from 'utility-types'
import { isUndefined } from 'tsfn'
import { isSaveAction, isLoadListStartAction, isLoadListErrorAction, isLoadListDoneAction } from '../actions'
import { TAction, TState } from '../types'
import { initialState } from '../store/initial-state'

export type TReducer<S extends {}> = (state: S, action: TAction<any>) => S

export const reducer: Reducer<DeepReadonly<TState>> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  if (isSaveAction(action)) {
    return {
      ...state,
      isSaved: true,
    }
  }

  if (isLoadListStartAction(action)) {
    return {
      ...state,
      isLoading: true,
    }
  }

  if (isLoadListErrorAction(action)) {
    return {
      ...state,
      error: action.error,
      isLoading: false,
    }
  }

  if (isLoadListDoneAction(action)) {
    return {
      ...state,
      isLoading: false,
      kind: action.payload.kind,
      files: action.payload.files,
    }
  }

  return state
}
