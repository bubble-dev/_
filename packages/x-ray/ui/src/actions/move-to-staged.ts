import { TActionWithPayload, TAnyAction, TItem } from '../types'

const TYPE_MOVE_TO_STAGED = 'MOVE_TO_STAGED'

export type TActionMoveToStaged = TActionWithPayload<typeof TYPE_MOVE_TO_STAGED, TItem>

export const actionMoveToStaged = (payload: TItem): TActionMoveToStaged => ({
  type: TYPE_MOVE_TO_STAGED,
  payload,
})

export const isActionMoveToStaged = (obj: TAnyAction): obj is TActionMoveToStaged => obj.type === TYPE_MOVE_TO_STAGED
