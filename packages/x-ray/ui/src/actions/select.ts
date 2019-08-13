import { TActionWithPayload, TAnyAction, TGridItem } from '../types'

const TYPE_SELECT = 'SELECT'

export type TActionSelect = TActionWithPayload<typeof TYPE_SELECT, TGridItem | null>

export const actionSelect = (payload: TGridItem | null): TActionSelect => ({
  type: TYPE_SELECT,
  payload,
})

export const isActionSelect = (obj: TAnyAction): obj is TActionSelect => obj.type === TYPE_SELECT
