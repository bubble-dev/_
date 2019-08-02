import { TActionWithPayload, TAnyAction, TResultType } from '../types'

const TYPE_MOVE_TO_STAGED = 'MOVE_TO_STAGED'

export type TActionMoveToStagedPayload = {
  file: string,
  item: string,
  type: TResultType,
}

export type TActionMoveToStaged = TActionWithPayload<typeof TYPE_MOVE_TO_STAGED, TActionMoveToStagedPayload>

export const actionMoveToStaged = (payload: TActionMoveToStagedPayload): TActionMoveToStaged => ({
  type: TYPE_MOVE_TO_STAGED,
  payload,
})

export const isActionMoveToStaged = (obj: TAnyAction): obj is TActionMoveToStaged => obj.type === TYPE_MOVE_TO_STAGED
