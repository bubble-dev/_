import { TActionWithPayload, TAnyAction } from '../types'

const TYPE_MOVE_TO_UNSTAGED = 'TYPE_MOVE_TO_UNSTAGED'

export type TActionMoveToUnstaged = TActionWithPayload<typeof TYPE_MOVE_TO_UNSTAGED, string>

export const actionMoveToUnstaged = (file: string): TActionMoveToUnstaged => ({
  type: TYPE_MOVE_TO_UNSTAGED,
  payload: file,
})

export const isActionMoveToUnstaged = (obj: TAnyAction): obj is TActionMoveToUnstaged => obj.type === TYPE_MOVE_TO_UNSTAGED
