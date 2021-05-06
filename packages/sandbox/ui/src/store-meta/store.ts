import { createStore, applyMiddleware, compose } from 'redux'
import type { Store } from 'redux'
import thunk from 'redux-thunk'
import { globalObject } from '../utils'
import { reducer } from './reducers'
import type { TMetaState, TMetaDispatch } from './types'
import { getHashInitialState } from './get-hash-initial-state'

export let store: Store<TMetaState> & {
  dispatch: TMetaDispatch,
}

if (process.env.NODE_ENV === 'development') {
  const composeWithDevTools: typeof compose = globalObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware<TMetaDispatch, TMetaState>(thunk)
    )
  )
} else {
  // @ts-ignore
  store = createStore(
    reducer,
    getHashInitialState(),
    applyMiddleware<TMetaDispatch, TMetaState>(thunk)
  )
}
