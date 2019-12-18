import { createStore, applyMiddleware, Store, compose, Reducer, AnyAction, Dispatch } from 'redux'
import { StoreContextFactory, ReduxDispatchFactory, ReduxStateFactory } from 'refun'
import { isUndefined } from 'tsfn'
import { reducer } from '../reducers'
import { locationHash, syncState } from '../middlewares'
import { TState } from '../types'
import { getInitialState } from './get-initial-state'

const composeWithDevTools = (global as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export let store: Store<TState>

// prod: URL ? urlState : initialState
// dev: sync ? sync : URL ? urlState : initialState
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(locationHash, syncState)
    )
  )
} else {
  store = createStore(reducer, getInitialState(), applyMiddleware(locationHash))
}

const StoreContext = StoreContextFactory(store)

export const StoreProvider = StoreContext.StoreProvider
export const mapStoreState = StoreContext.mapStoreState
export const mapStoreDispatch = StoreContext.mapStoreDispatch

export const injectReducer = <S, A extends AnyAction>(injectedReducer: Reducer<S, A>) => {
  store.replaceReducer(
    (state: any, action: any) => {
      if (isUndefined(state)) {
        return {
          ...reducer(state, action),
          ...injectedReducer(state, action),
        }
      }

      const newState: any = reducer(state, action)

      return injectedReducer(newState, action) as any
    }
  )

  // return StoreContextFactory(store as Store<TState & S>)
  return {
    StoreProvider,
    mapStoreState: ReduxStateFactory<TState & S, Dispatch<A>>(StoreContext.Context as any),
    mapStoreDispatch: ReduxDispatchFactory<TState & S, Dispatch<A>>(StoreContext.Context as any),
  }
}
