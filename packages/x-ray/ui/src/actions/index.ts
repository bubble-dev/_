import { TServerResult } from '@x-ray/common-utils'
import { TAction, TActionAsync, TAnyAction, TActionWithPayload } from '../types'
import { loadListApi, saveApi } from '../api'

const TYPE_ERROR = 'ERROR'
const TYPE_LOADING_START = 'LOADING_START'
const TYPE_LOADING_END = 'LOADING_END'
const TYPE_LOAD_LIST = 'LOAD_LIST'
const TYPE_LOAD_SNAPSHOT = 'LOAD_SNAPSHOT'
const TYPE_SAVE = 'SAVE'

export type TErrorAction = TAction<typeof TYPE_ERROR>
export type TLoadingStartAction = TAction<typeof TYPE_LOADING_START>
export type TLoadingEndAction = TAction<typeof TYPE_LOADING_END>

export type TLoadListAction = TActionWithPayload<typeof TYPE_LOAD_LIST, TServerResult>
export type TLoadSnapshotAction = TActionWithPayload<typeof TYPE_LOAD_SNAPSHOT, string>
export type TSaveAction = TAction<typeof TYPE_SAVE>

export const errorAction = (error: string): TErrorAction => ({
  type: TYPE_ERROR,
  error,
})

export const loadingStartAction = (): TLoadingStartAction => ({
  type: TYPE_LOADING_START,
})

export const loadingEndAction = (): TLoadingEndAction => ({
  type: TYPE_LOADING_END,
})

export const saveAction = (): TActionAsync<TSaveAction | TErrorAction | TLoadingStartAction | TLoadingEndAction> => async (dispatch) => {
  try {
    dispatch(loadingStartAction())

    await saveApi()

    dispatch({ type: TYPE_SAVE })
  } catch (err) {
    dispatch(errorAction(err.message))
  } finally {
    dispatch(loadingEndAction())
  }
}

export const loadListAction = (): TActionAsync<TLoadListAction | TErrorAction | TLoadingStartAction | TLoadingEndAction> => async (dispatch) => {
  try {
    dispatch(loadingStartAction())

    const result = await loadListApi()

    dispatch({ type: TYPE_LOAD_LIST, payload: result })
  } catch (err) {
    dispatch(errorAction(err.message))
  } finally {
    dispatch(loadingEndAction())
  }
}

export const isErrorAction = (obj: TAnyAction): obj is TErrorAction => obj.type === TYPE_ERROR
export const isLoadingStartAction = (obj: TAnyAction): obj is TLoadingStartAction => obj.type === TYPE_LOADING_START
export const isLoadingEndAction = (obj: TAnyAction): obj is TLoadingEndAction => obj.type === TYPE_LOADING_END

export const isLoadListAction = (obj: TAnyAction): obj is TLoadListAction => obj.type === TYPE_LOAD_LIST
export const isSaveAction = (obj: TAnyAction): obj is TSaveAction => obj.type === TYPE_SAVE
