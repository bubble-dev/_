import { TActionWithPayload, TAnyAction, TItem } from '../types'

const TYPE_SELECT = 'SELECT'

export type TActionSelect = TActionWithPayload<typeof TYPE_SELECT, TItem>

export const actionSelect = (payload: TItem): TActionSelect => ({
  type: TYPE_SELECT,
  payload,
})

export const isActionSelect = (obj: TAnyAction): obj is TActionSelect => obj.type === TYPE_SELECT
