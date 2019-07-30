import { TServerResult } from '@x-ray/common-utils'
import { TAction, TAnyAction, TActionCreatorAsync, TActionWithPayload } from '../types'
import { loadListApi, saveApi } from '../api'

const ERROR = 'ERROR'
const LOADING_START = 'LOADING_START'
const LOADING_END = 'LOADING_END'
const LOAD_LIST = 'LOAD_LIST'
const SAVE = 'SAVE'

export type TErrorAction = TAction<typeof ERROR>
export type TLoadingStartAction = TAction<typeof LOADING_START>
export type TLoadingEndAction = TAction<typeof LOADING_END>

export type TLoadListAction = TActionWithPayload<typeof LOAD_LIST, TServerResult>
export type TSaveAction = TAction<typeof SAVE>

export const saveAction: TActionCreatorAsync<TSaveAction | TErrorAction | TLoadingStartAction | TLoadingEndAction> = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_START })

    await saveApi()

    dispatch({ type: SAVE })
  } catch (err) {
    dispatch({ type: ERROR, error: err.message })
  } finally {
    dispatch({ type: LOADING_END })
  }
}

export const loadListAction: TActionCreatorAsync<TLoadListAction | TErrorAction | TLoadingStartAction | TLoadingEndAction> = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_START })

    const result = await loadListApi()

    dispatch({ type: LOAD_LIST, payload: result })
  } catch (err) {
    dispatch({ type: ERROR, error: err.message })
  } finally {
    dispatch({ type: LOADING_END })
  }
}

export const isErrorAction = (obj: TAnyAction): obj is TErrorAction => obj.type === ERROR
export const isLoadingStartAction = (obj: TAnyAction): obj is TLoadingStartAction => obj.type === LOADING_START
export const isLoadingEndAction = (obj: TAnyAction): obj is TLoadingEndAction => obj.type === LOADING_END

export const isLoadListAction = (obj: TAnyAction): obj is TLoadListAction => obj.type === LOAD_LIST
export const isSaveAction = (obj: TAnyAction): obj is TSaveAction => obj.type === SAVE
