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
import { TAction, TState, TItem } from '../types'
import { initialState } from '../store/initial-state'
import { isEqualItems, itemsSorter } from '../utils'

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
      unstagedItems: Object.entries(action.payload.files)
        .reduce((result, [file, value]) => {
          value.new.forEach((name) => {
            result.push({
              file,
              type: 'new',
              name,
            })
          })

          value.diff.forEach((name) => {
            result.push({
              file,
              type: 'diff',
              name,
            })
          })

          value.deleted.forEach((name) => {
            result.push({
              file,
              type: 'deleted',
              name,
            })
          })

          return result
        }, [] as TItem[])
        .sort(itemsSorter),
    }
  }

  if (isActionMoveToStaged(action)) {
    return {
      ...state,
      unstagedItems: state.unstagedItems
        .filter((item) => !isEqualItems(item, action.payload))
        .sort(itemsSorter),
      stagedItems: state.stagedItems
        .concat(action.payload)
        .sort(itemsSorter),
    }
  }

  if (isActionMoveToUnstaged(action)) {
    return {
      ...state,
      stagedItems: state.stagedItems
        .filter((item) => !isEqualItems(item, action.payload))
        .sort(itemsSorter),
      unstagedItems: state.unstagedItems
        .concat(action.payload)
        .sort(itemsSorter),
    }
  }

  if (isActionSelect(action)) {
    return {
      ...state,
      selectedItem: action.payload,
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
