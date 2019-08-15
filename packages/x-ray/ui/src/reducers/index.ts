import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import { TLineElement } from 'syntx'
import {
  isActionLoadingStart,
  isActionLoadingEnd,
  isActionError,
  isActionLoadList,
  isActionSave,
  isActionSelect,
} from '../actions'
import { TAction, TState, TItem } from '../types'
import { initialState } from '../store/initial-state'
import { itemsSorter } from '../utils'

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
      type: action.payload.type,
      items: Object.entries(action.payload.files)
        .reduce((result, [file, value]) => {
          const allIds = new Set([...Object.keys(value.new), ...Object.keys(value.old)])

          allIds.forEach((id) => {
            if (Reflect.has(value.new, id)) {
              if (Reflect.has(value.old, id)) {
                // diff
                result.push({
                  type: 'diff',
                  file,
                  id,
                  serializedElement: value.old[id].serializedElement as TLineElement[][],
                  width: value.old[id].width,
                  height: value.old[id].height,
                  newWidth: value.new[id].width,
                  newHeight: value.new[id].height,
                })
              } else {
                // new
                result.push({
                  type: 'new',
                  file,
                  id,
                  serializedElement: value.new[id].serializedElement as TLineElement[][],
                  width: value.new[id].width,
                  height: value.new[id].height,
                })
              }
            } else {
              // deleted
              result.push({
                type: 'deleted',
                file,
                id,
                serializedElement: value.old[id].serializedElement as TLineElement[][],
                width: value.old[id].width,
                height: value.old[id].height,
              })
            }
          })

          return result
        }, [] as TItem[])
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
