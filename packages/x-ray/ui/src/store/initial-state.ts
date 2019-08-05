import { TState } from '../types'

export const initialState: TState = {
  itemsToStage: [],
  itemsToUnstage: [],
  stagedItems: [],
  unstagedItems: [],
  isSaved: false,
  isLoading: false,
}
