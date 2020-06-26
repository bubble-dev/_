import { Store, createStore } from 'redux'
import { TState } from './types'
import { reducer } from './reducers'
import { getInitialState } from './initial-state'

export const store: Store<TState> = createStore(
  reducer,
  getInitialState()
)
