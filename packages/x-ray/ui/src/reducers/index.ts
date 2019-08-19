import { Reducer } from 'redux'
import { isUndefined, objectHas } from 'tsfn'
import { TLineElement } from 'syntx'
import {
  isActionLoadingStart,
  isActionLoadingEnd,
  isActionError,
  isActionLoadList,
  isActionSave,
  isActionSelectSnapshot,
  isActionSelectScreenshot,
  isActionDeselect,
  isActionDiscardItem,
} from '../actions'
import { TAction, TState, TScreenshotItems, TSnapshotItems } from '../types'
import { initialState } from '../store/initial-state'

const getId = (file: string, id: string): string => `${file}:${id}`

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
    if (action.payload.type === 'image') {
      return {
        ...state,
        selectedItem: null,
        discardedItems: [],
        type: 'image',
        items: Object.entries(action.payload.files)
          .reduce((result, [file, value]) => {
            const allIds = new Set([...Object.keys(value.new), ...Object.keys(value.old)])

            allIds.forEach((itemId) => {
              const id = getId(file, itemId)

              if (objectHas(value.new, itemId)) {
                if (objectHas(value.old, itemId)) {
                  // diff
                  result[id] = {
                    type: 'diff',
                    serializedElement: value.old[itemId].serializedElement as TLineElement[][],
                    width: value.old[itemId].width,
                    height: value.old[itemId].height,
                    newWidth: value.new[itemId].width,
                    newHeight: value.new[itemId].height,
                  }
                } else {
                  // new
                  result[id] = {
                    type: 'new',
                    serializedElement: value.new[itemId].serializedElement as TLineElement[][],
                    width: value.new[itemId].width,
                    height: value.new[itemId].height,
                  }
                }
              } else {
                // deleted
                result[id] = {
                  type: 'deleted',
                  serializedElement: value.old[itemId].serializedElement as TLineElement[][],
                  width: value.old[itemId].width,
                  height: value.old[itemId].height,
                }
              }
            })

            return result
          }, {} as TScreenshotItems),
      }
    } else if (action.payload.type === 'text') {
      return {
        ...state,
        selectedItem: null,
        discardedItems: [],
        type: 'text',
        items: action.payload.files,
        // items: Object.entries(action.payload.files)
        //   .reduce((result, [file, value]) => {
        //     if (objectHas(value, 'diff')) {
        //       Object.keys(value.diff).forEach((itemId) => {
        //         const id = getId(file, itemId)

        //         result[id] = {
        //           type: 'diff',
        //           serializedElement: value.diff[itemId].serializedElement as TLineElement[][],
        //           width: value.diff[itemId].width,
        //           height: value.diff[itemId].height,
        //         }
        //       })
        //     }

        //     if (objectHas(value, 'new')) {
        //       Object.keys(value.new).forEach((itemId) => {
        //         const id = getId(file, itemId)

        //         result[id] = {
        //           type: 'new',
        //           serializedElement: value.new[itemId].serializedElement as TLineElement[][],
        //           width: value.new[itemId].width,
        //           height: value.new[itemId].height,
        //         }
        //       })
        //     }

        //     if (objectHas(value, 'deleted')) {
        //       Object.keys(value.deleted).forEach((itemId) => {
        //         const id = getId(file, itemId)

        //         result[id] = {
        //           type: 'deleted',
        //           serializedElement: value.deleted[itemId].serializedElement as TLineElement[][],
        //           width: value.deleted[itemId].width,
        //           height: value.deleted[itemId].height,
        //         }
        //       })
        //     }

        //     return result
        //   }, {} as TSnapshotItems),
      }
    }
  }

  if (isActionSelectScreenshot(action) && state.type === 'image') {
    return {
      ...state,
      selectedItem: action.payload,
    }
  }

  if (isActionSelectSnapshot(action) && state.type === 'text') {
    return {
      ...state,
      selectedItem: action.payload,
    }
  }

  if (isActionDeselect(action)) {
    return {
      ...state,
      selectedItem: null,
    }
  }

  if (isActionDiscardItem(action)) {
    if (state.discardedItems.includes(action.payload)) {
      return state
    }

    return {
      ...state,
      discardedItems: state.discardedItems.concat(action.payload),
    }
  }

  if (isActionSave(action)) {
    return {
      ...state,
      isSaved: true,
      discardedItems: [],
    }
  }

  return state
}
