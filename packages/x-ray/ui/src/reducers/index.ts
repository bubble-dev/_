import { Reducer } from 'redux'
import { DeepReadonly } from 'utility-types'
import { isUndefined } from 'tsfn'
import {
  isActionLoadingStart,
  isActionLoadingEnd,
  isActionError,
  isActionLoadList,
  isActionSave,
  isActionMoveToStaged,
  isActionMoveToUnstaged,
  isActionSelect,
} from '../actions'
import { TAction, TState } from '../types'
import { initialState } from '../store/initial-state'

export type TReducer<S extends {}> = (state: S, action: TAction<any>) => S

export const reducer: Reducer<DeepReadonly<TState>> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  if (isActionLoadingStart(action)) {
    return {
      ...state,
      isLoading: true,
    }
  }

  if (isActionLoadingEnd(action)) {
    return {
      ...state,
      isLoading: false,
    }
  }

  if (isActionError(action)) {
    return {
      ...state,
      error: action.error,
    }
  }

  if (isActionLoadList(action)) {
    return {
      ...state,
      kind: action.payload.kind,
      files: action.payload.files,
      unstagedList: Object.keys(action.payload.files),
    }
  }

  if (isActionMoveToStaged(action)) {
    return {
      ...state,
      unstagedList: state.unstagedList.filter((item) => item !== action.payload),
      stagedList: [
        ...state.stagedList,
        action.payload,
      ],
    }
  }

  if (isActionMoveToUnstaged(action)) {
    return {
      ...state,
      stagedList: state.stagedList.filter((item) => item !== action.payload),
      unstagedList: [
        ...state.unstagedList,
        action.payload,
      ],
    }
  }

  if (isActionSelect(action)) {
    return {
      ...state,
      selectedFile: action.payload.file,
      selectedItem: action.payload.item,
      selectedType: action.payload.type,
    }
  }

  if (isActionSave(action)) {
    return {
      ...state,
      isSaved: true,
    }
  }

  return state
}
