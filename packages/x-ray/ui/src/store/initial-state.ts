import { TState } from '../types'

export const initialState: TState = {
  isSaved: false,
  isLoading: false,
  type: null,
  selectedItem: null,
  items: {},
  discardedItems: [],
}
