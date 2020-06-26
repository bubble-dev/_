import { Store } from 'redux'
import { TKeyOf, isObject } from 'tsfn'
import { shallowEqualByKeys } from 'refun'
import { TMetaState } from '../store-meta/types'
import { initialState as metaInitialState } from '../store-meta/initial-state'
import { updateComponentProps } from '../store-meta'
import { initialState as mainInitialState } from '../store/initial-state'
import { objectPick } from '../store/utils/object-pick'
import { navigate } from '../store'
import { TState as TMainState } from '../store/types'
import { TSyncStore, TMainSubState, TMetaSubState, TSyncState } from './types'

export const SyncStoreFactory = (mainStore: Store<TMainState>, metaStore: Store<TMetaState>): TSyncStore => {
  const mainStateKeys: TKeyOf<TMainSubState>[] = ['width', 'height', 'transformX', 'transformY', 'transformZ', 'resolutionKey', 'shouldStretch', 'hasGrid', 'isCanvasDarkMode']
  const metaStateKeys: TKeyOf<TMetaSubState>[] = ['componentKey', 'propsIndex']
  let mainKnownState: TMainSubState = objectPick(mainStore.getState(), mainStateKeys)
  let metaKnownState: TMetaSubState = objectPick(metaStore.getState(), metaStateKeys)
  let isMainStateUpdating = false
  let isMetaStateUpdating = false
  const subscribers: Set<(state: TSyncState) => void> = new Set()

  const callSubscribers = (state: TSyncState) => {
    for (const sub of subscribers) {
      sub(state)
    }
  }

  const isValidState = (obj: any): obj is TSyncState =>
    isObject(obj) &&
    mainStateKeys.every((k) => Reflect.has(obj, k)) &&
    metaStateKeys.every((k) => Reflect.has(obj, k))

  mainStore.subscribe(() => {
    if (isMainStateUpdating) {
      return
    }

    const state = objectPick(mainStore.getState(), mainStateKeys)

    if (shallowEqualByKeys(mainKnownState, state, mainStateKeys)) {
      return
    }

    mainKnownState = state

    callSubscribers({
      ...state,
      ...metaKnownState,
    })
  })
  metaStore.subscribe(() => {
    if (isMetaStateUpdating) {
      return
    }

    const state = objectPick(metaStore.getState(), metaStateKeys)

    if (shallowEqualByKeys(metaKnownState, state, metaStateKeys)) {
      return
    }

    metaKnownState = state

    callSubscribers({
      ...mainKnownState,
      ...state,
    })
  })

  return {
    getInitialState: (): TSyncState => ({
      ...objectPick(mainInitialState, mainStateKeys),
      ...objectPick(metaInitialState, metaStateKeys),
    }),
    setState: async (incoming: any) => {
      if (!isValidState(incoming)) {
        return
      }

      // Check if mainState should be updated
      const incomingMainState = objectPick(incoming, mainStateKeys)

      if (!shallowEqualByKeys(incomingMainState, mainKnownState, mainStateKeys)) {
        mainKnownState = incomingMainState
        isMainStateUpdating = true

        navigate(incomingMainState)
        isMainStateUpdating = false
      }

      // Check if metaState should be updated
      const incomingMetaState = objectPick(incoming, metaStateKeys)

      if (!shallowEqualByKeys(incomingMetaState, metaKnownState, metaStateKeys)) {
        metaKnownState = incomingMetaState
        isMetaStateUpdating = true

        await updateComponentProps(incomingMetaState.componentKey, incomingMetaState.propsIndex)
        isMetaStateUpdating = false
      }
    },
    subscribe: (observer: (state: TSyncState) => void) => {
      subscribers.add(observer)
    },
  }
}
