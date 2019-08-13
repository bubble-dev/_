import { TActionWithPayload, TAnyAction, TItemWithPosition } from '../types'

const TYPE_SELECT = 'SELECT'

export type TActionSelect = TActionWithPayload<typeof TYPE_SELECT, TItemWithPosition | null>

export const actionSelect = (payload: TItemWithPosition | null): TActionSelect => ({
  type: TYPE_SELECT,
  payload,
})

export const isActionSelect = (obj: TAnyAction): obj is TActionSelect => obj.type === TYPE_SELECT
