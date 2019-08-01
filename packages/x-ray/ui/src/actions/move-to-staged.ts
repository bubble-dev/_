import { TActionWithPayload, TAnyAction } from '../types'

const TYPE_MOVE_TO_STAGED = 'TYPE_MOVE_TO_STAGED'

export type TActionMoveToStaged = TActionWithPayload<typeof TYPE_MOVE_TO_STAGED, string>

export const actionMoveToStaged = (file: string): TActionMoveToStaged => ({
  type: TYPE_MOVE_TO_STAGED,
  payload: file,
})

export const isActionMoveToStaged = (obj: TAnyAction): obj is TActionMoveToStaged => obj.type === TYPE_MOVE_TO_STAGED
