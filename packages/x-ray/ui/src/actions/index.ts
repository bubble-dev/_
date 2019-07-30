import { TServerResult } from '@x-ray/common-utils'
import { TAction, TActionCreator, TAnyAction, TActionCreatorAsync, TActionWithPayload } from '../types'
import { loadListApi } from '../api'

const SAVE = 'SAVE'
const LOAD_LIST_START = 'LOAD_LIST_START'
const LOAD_LIST_ERROR = 'LOAD_LIST_ERROR'
const LOAD_LIST_DONE = 'LOAD_LIST_DONE'

export type TSaveAction = TAction<typeof SAVE>
export type TLoadListStartAction = TAction<typeof LOAD_LIST_START>
export type TLoadListErrorAction = TAction<typeof LOAD_LIST_ERROR>
export type TLoadListDoneAction = TActionWithPayload<typeof LOAD_LIST_DONE, TServerResult>
export type TLoadListAction = TLoadListStartAction | TLoadListErrorAction | TLoadListDoneAction

export const saveAction: TActionCreator<TSaveAction> = () => ({
  type: SAVE,
})

export const loadListAction: TActionCreatorAsync<TLoadListAction> = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_LIST_START })

    const result = await loadListApi()

    dispatch({ type: LOAD_LIST_DONE, payload: result })
  } catch (err) {
    dispatch({ type: LOAD_LIST_ERROR, error: err.message })
  }
}

export const isSaveAction = (obj: TAnyAction): obj is TSaveAction => obj.type === SAVE
export const isLoadListStartAction = (obj: TAnyAction): obj is TLoadListStartAction => obj.type === LOAD_LIST_START
export const isLoadListErrorAction = (obj: TAnyAction): obj is TLoadListErrorAction => obj.type === LOAD_LIST_ERROR
export const isLoadListDoneAction = (obj: TAnyAction): obj is TLoadListDoneAction => obj.type === LOAD_LIST_DONE
