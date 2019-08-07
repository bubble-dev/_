import { TState } from '../types'

export const initialState: TState = {
  itemsToStage: [],
  itemsToUnstage: [],
  stagedItems: [],
  unstagedItems: [],
  stagedPageIndex: 0,
  unstagedPageIndex: 0,
  isSaved: false,
  isLoading: false,
}
