import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
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
          const allProps = new Set([...Object.keys(value.new), ...Object.keys(value.old)])

          allProps.forEach((props) => {
            if (Reflect.has(value.new, props)) {
              if (Reflect.has(value.old, props)) {
                // diff
                result.push({
                  type: 'diff',
                  file,
                  props,
                  width: value.old[props].width,
                  height: value.old[props].height,
                  newWidth: value.new[props].width,
                  newHeight: value.new[props].height,
                })
              } else {
                // new
                result.push({
                  type: 'new',
                  file,
                  props,
                  width: value.new[props].width,
                  height: value.new[props].height,
                })
              }
            } else {
              // deleted
              result.push({
                type: 'deleted',
                file,
                props,
                width: value.old[props].width,
                height: value.old[props].height,
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
