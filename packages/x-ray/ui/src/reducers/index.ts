import { Reducer } from 'redux'
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
  isActionToggleAsStaged,
  isActionToggleAsUnstaged,
} from '../actions'
import { TAction, TState, TItem } from '../types'
import { initialState } from '../store/initial-state'
import { itemsSorter, isEqualItems, hasItem } from '../utils'

export type TReducer<S extends {}> = (state: S, action: TAction<any>) => S

export const reducer: Reducer<TState> = (state, action) => {
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
    // TODO: remove me
    console.error(action.error)

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

  if (isActionToggleAsStaged(action)) {
    if (hasItem(state.itemsToStage, action.payload)) {
      return {
        ...state,
        itemsToStage: state.itemsToStage.filter((item) => !isEqualItems(item, action.payload)),
      }
    }

    return {
      ...state,
      itemsToStage: state.itemsToStage.concat(action.payload),
    }
  }

  if (isActionMoveToStaged(action)) {
    return {
      ...state,
      itemsToStage: [],
      unstagedItems: state.unstagedItems
        .filter((item) => !hasItem(state.itemsToStage, item))
        .sort(itemsSorter),
      stagedItems: state.stagedItems
        .concat(state.itemsToStage)
        .sort(itemsSorter),
    }
  }

  if (isActionToggleAsUnstaged(action)) {
    if (hasItem(state.itemsToUnstage, action.payload)) {
      return {
        ...state,
        itemsToUnstage: state.itemsToUnstage.filter((item) => !isEqualItems(item, action.payload)),
      }
    }

    return {
      ...state,
      itemsToUnstage: state.itemsToUnstage.concat(action.payload),
    }
  }

  if (isActionMoveToUnstaged(action)) {
    return {
      ...state,
      itemsToUnstage: [],
      stagedItems: state.stagedItems
        .filter((item) => !hasItem(state.itemsToUnstage, item))
        .sort(itemsSorter),
      unstagedItems: state.unstagedItems
        .concat(state.itemsToUnstage)
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