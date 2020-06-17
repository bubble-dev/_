import { Store, createStore } from 'redux'
import { globalObject } from '../utils'
import { TState } from './types'
import { reducer } from './reducers'
import { getInitialState } from './initial-state'

export let store: Store<TState>

// prod: URL ? urlState : initialState
// dev: sync ? sync : URL ? urlState : initialState
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    reducer,
    globalObject.__REDUX_DEVTOOLS_EXTENSION__ && globalObject.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  store = createStore(
    reducer,
    getInitialState()
  )
}
