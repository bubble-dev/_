import { TAnyAction, TActionWithPayload } from '../types'

const TYPE_CHANGE_UNSTAGED_PAGE = 'CHANGE_UNSTAGED_PAGE'

export type TActionChangeUnstagedPage = TActionWithPayload<typeof TYPE_CHANGE_UNSTAGED_PAGE, number>

export const actionChangeUnstagedPage = (index: number): TActionChangeUnstagedPage => ({
  type: TYPE_CHANGE_UNSTAGED_PAGE,
  payload: index,
})

export const isActionChangeUnstagedPage = (obj: TAnyAction): obj is TActionChangeUnstagedPage => obj.type === TYPE_CHANGE_UNSTAGED_PAGE
