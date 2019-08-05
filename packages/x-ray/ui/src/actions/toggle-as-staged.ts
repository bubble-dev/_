import { TActionWithPayload, TAnyAction, TItem } from '../types'

const TYPE_TOGGLE_AS_STAGED = 'TOGGLE_AS_STAGED'

export type TActionToggleAsStaged = TActionWithPayload<typeof TYPE_TOGGLE_AS_STAGED, TItem>

export const actionToggleAsStaged = (payload: TItem): TActionToggleAsStaged => ({
  type: TYPE_TOGGLE_AS_STAGED,
  payload,
})

export const isActionToggleAsStaged = (obj: TAnyAction): obj is TActionToggleAsStaged => obj.type === TYPE_TOGGLE_AS_STAGED
