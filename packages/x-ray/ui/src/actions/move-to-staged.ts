import { TAnyAction, TAction } from '../types'

const TYPE_MOVE_TO_STAGED = 'MOVE_TO_STAGED'

export type TActionMoveToStaged = TAction<typeof TYPE_MOVE_TO_STAGED>

export const actionMoveToStaged = (): TActionMoveToStaged => ({
  type: TYPE_MOVE_TO_STAGED,
})

export const isActionMoveToStaged = (obj: TAnyAction): obj is TActionMoveToStaged => obj.type === TYPE_MOVE_TO_STAGED
