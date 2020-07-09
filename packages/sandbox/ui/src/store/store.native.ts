import { Store, createStore } from 'redux'
import { TState } from './types'
import { reducer } from './reducers'

export const store: Store<TState> = createStore(
  reducer
)
