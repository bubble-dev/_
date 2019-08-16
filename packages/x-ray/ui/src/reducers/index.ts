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
} from '../actions'
import { TAction, TState, TScreenshotItem, TSnapshotItem } from '../types'
import { initialState } from '../store/initial-state'
import { screenshotsSorter, snapshotsSorter } from '../utils'

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
        type: 'image',
        items: Object.entries(action.payload.files)
          .reduce((result, [file, value]) => {
            const allIds = new Set([...Object.keys(value.new), ...Object.keys(value.old)])

            allIds.forEach((id) => {
              if (objectHas(value.new, id)) {
                if (objectHas(value.old, id)) {
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
          }, [] as TScreenshotItem[])
          .sort(screenshotsSorter),
      }
    } else if (action.payload.type === 'text') {
      return {
        ...state,
        selectedItem: null,
        type: 'text',
        items: Object.entries(action.payload.files)
          .reduce((result, [file, value]) => {
            if (objectHas(value, 'diff')) {
              Object.keys(value.diff).forEach((id) => {
                result.push({
                  type: 'diff',
                  file,
                  id,
                  serializedElement: value.diff[id].serializedElement as TLineElement[][],
                  width: value.diff[id].width,
                  height: value.diff[id].height,
                })
              })
            }

            if (objectHas(value, 'new')) {
              Object.keys(value.new).forEach((id) => {
                result.push({
                  type: 'new',
                  file,
                  id,
                  serializedElement: value.new[id].serializedElement as TLineElement[][],
                  width: value.new[id].width,
                  height: value.new[id].height,
                })
              })
            }

            if (objectHas(value, 'deleted')) {
              Object.keys(value.deleted).forEach((id) => {
                result.push({
                  type: 'deleted',
                  file,
                  id,
                  serializedElement: value.deleted[id].serializedElement as TLineElement[][],
                  width: value.deleted[id].width,
                  height: value.deleted[id].height,
                })
              })
            }

            return result
          }, [] as TSnapshotItem[])
          .sort(snapshotsSorter),
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

  if (isActionSave(action)) {
    return {
      ...state,
      isSaved: true,
    }
  }

  return state
}
