import { TAnyAction, TAction } from '../types'

const TYPE_MOVE_TO_UNSTAGED = 'MOVE_TO_UNSTAGED'

export type TActionMoveToUnstaged = TAction<typeof TYPE_MOVE_TO_UNSTAGED>

export const actionMoveToUnstaged = (): TActionMoveToUnstaged => ({
  type: TYPE_MOVE_TO_UNSTAGED,
})

export const isActionMoveToUnstaged = (obj: TAnyAction): obj is TActionMoveToUnstaged => obj.type === TYPE_MOVE_TO_UNSTAGED
