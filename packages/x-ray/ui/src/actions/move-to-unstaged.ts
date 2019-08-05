import { TActionWithPayload, TAnyAction, TItem } from '../types'

const TYPE_MOVE_TO_UNSTAGED = 'MOVE_TO_UNSTAGED'

export type TActionMoveToUnstaged = TActionWithPayload<typeof TYPE_MOVE_TO_UNSTAGED, TItem>

export const actionMoveToUnstaged = (payload: TItem): TActionMoveToUnstaged => ({
  type: TYPE_MOVE_TO_UNSTAGED,
  payload,
})

export const isActionMoveToUnstaged = (obj: TAnyAction): obj is TActionMoveToUnstaged => obj.type === TYPE_MOVE_TO_UNSTAGED
