import { Reducer } from 'redux'
import { DeepReadonly } from 'utility-types'
import { isUndefined } from 'tsfn'
import { TResult, TFileResult } from '@x-ray/common-utils'
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
      unstagedList: action.payload.files,
    }
  }

  if (isActionMoveToStaged(action)) {
    return {
      ...state,
      unstagedList: Object.keys(state.unstagedList).reduce((result, file) => {
        if (file === action.payload.file) {
          const fileResult = {
            ...state.unstagedList[file],
            [action.payload.type]: state.unstagedList[file][action.payload.type].filter((item) => item !== action.payload.item),
          } as TFileResult

          const isEmpty = Object.values(fileResult).every((values) => values.length === 0)

          if (!isEmpty) {
            result[file] = fileResult
          }
        } else {
          result[file] = state.unstagedList[file] as TFileResult
        }

        return result
      }, {} as TResult),
      stagedList: {
        ...state.stagedList,
        [action.payload.file]: {
          ...state.stagedList[action.payload.file],
          [action.payload.type]: [
            ...(state.stagedList[action.payload.file] ? state.stagedList[action.payload.file][action.payload.type] : []),
            action.payload.item,
          ],
        },
      },
    }
  }

  if (isActionMoveToUnstaged(action)) {
    return {
      ...state,
      stagedList: Object.keys(state.stagedList).reduce((result, file) => {
        if (file === action.payload.file) {
          const fileResult = {
            ...state.stagedList[file],
            [action.payload.type]: state.stagedList[file][action.payload.type].filter((item) => item !== action.payload.item),
          } as TFileResult

          const isEmpty = Object.values(fileResult).every((values) => values.length === 0)

          if (!isEmpty) {
            result[file] = fileResult
          }
        } else {
          result[file] = state.stagedList[file] as TFileResult
        }

        return result
      }, {} as TResult),
      unstagedList: {
        ...state.unstagedList,
        [action.payload.file]: {
          ...state.unstagedList[action.payload.file],
          [action.payload.type]: [
            ...(state.unstagedList[action.payload.file] ? state.unstagedList[action.payload.file][action.payload.type] : []),
            action.payload.item,
          ],
        },
      },
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
