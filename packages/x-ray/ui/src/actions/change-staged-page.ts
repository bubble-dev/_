import { TAnyAction, TActionWithPayload } from '../types'

const TYPE_CHANGE_STAGED_PAGE = 'CHANGE_STAGED_PAGE'

export type TActionChangeStagedPage = TActionWithPayload<typeof TYPE_CHANGE_STAGED_PAGE, number>

export const actionChangeStagedPage = (index: number): TActionChangeStagedPage => ({
  type: TYPE_CHANGE_STAGED_PAGE,
  payload: index,
})

export const isActionChangeStagedPage = (obj: TAnyAction): obj is TActionChangeStagedPage => obj.type === TYPE_CHANGE_STAGED_PAGE
