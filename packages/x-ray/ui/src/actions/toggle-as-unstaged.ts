import { TActionWithPayload, TAnyAction, TItem } from '../types'

const TYPE_TOGGLE_AS_UNSTAGED = 'TOGGLE_AS_UNSTAGED'

export type TActionToggleAsUnstaged = TActionWithPayload<typeof TYPE_TOGGLE_AS_UNSTAGED, TItem>

export const actionToggleAsUnstaged = (payload: TItem): TActionToggleAsUnstaged => ({
  type: TYPE_TOGGLE_AS_UNSTAGED,
  payload,
})

export const isActionToggleAsUnstaged = (obj: TAnyAction): obj is TActionToggleAsUnstaged => obj.type === TYPE_TOGGLE_AS_UNSTAGED
