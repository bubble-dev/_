import { TAction, TActionAsync, TAnyAction, TScreenshotItem, TType, TSnapshotItem } from '../types'
import { apiSave } from '../api'
import { TActionError, actionError } from './error'
import { TActionLoadingStart, TActionLoadingEnd, actionLoadingStart, actionLoadingEnd } from './loading'

const TYPE_SAVE = 'SAVE'

export type TActionSave = TAction<typeof TYPE_SAVE>

export const actionSave = (type: TType, items: (TScreenshotItem | TSnapshotItem)[]): TActionAsync<TActionSave | TActionError | TActionLoadingStart | TActionLoadingEnd> =>
  async (dispatch) => {
    try {
      dispatch(actionLoadingStart())

      await apiSave(type, items)

      dispatch({ type: TYPE_SAVE })
    } catch (err) {
      console.log(err)
      dispatch(actionError(err.message))
    } finally {
      dispatch(actionLoadingEnd())
    }
  }

export const isActionSave = (obj: TAnyAction): obj is TActionSave => obj.type === TYPE_SAVE
