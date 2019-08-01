import { TActionWithPayload, TAnyAction, TResultType } from '../types'

const TYPE_SELECT = 'SELECT'

export type TActionSelectPayload = {
  file: string,
  item: string,
  type: TResultType,
}

export type TActionSelect = TActionWithPayload<typeof TYPE_SELECT, TActionSelectPayload>

export const actionSelect = (payload: TActionSelectPayload): TActionSelect => ({
  type: TYPE_SELECT,
  payload,
})

export const isActionSelect = (obj: TAnyAction): obj is TActionSelect => obj.type === TYPE_SELECT
