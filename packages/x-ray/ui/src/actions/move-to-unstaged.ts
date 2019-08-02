import { TActionWithPayload, TAnyAction, TResultType } from '../types'

const TYPE_MOVE_TO_UNSTAGED = 'MOVE_TO_UNSTAGED'

export type TActionMoveToUnstagedPayload = {
  file: string,
  item: string,
  type: TResultType,
}

export type TActionMoveToUnstaged = TActionWithPayload<typeof TYPE_MOVE_TO_UNSTAGED, TActionMoveToUnstagedPayload>

export const actionMoveToUnstaged = (payload: TActionMoveToUnstagedPayload): TActionMoveToUnstaged => ({
  type: TYPE_MOVE_TO_UNSTAGED,
  payload,
})

export const isActionMoveToUnstaged = (obj: TAnyAction): obj is TActionMoveToUnstaged => obj.type === TYPE_MOVE_TO_UNSTAGED
