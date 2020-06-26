import { Store } from 'redux'
import { EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from 'refun'
import { objectPick } from './object-pick'

export const storeSubscribeFactory = <S extends {}>(store: Store<S>) => <K extends keyof S>(keys: K[], fn: (state: { [k in K]: S[k] }) => void) => {
  let prevState: S = EMPTY_OBJECT

  store.subscribe(() => {
    const nextState = store.getState()

    if (!shallowEqualByKeys(prevState, nextState, keys)) {
      prevState = nextState
      fn(objectPick(nextState, keys))
    }
  })
}
