import { globalObject, setCurrentHash, encodeUrl } from '../utils'
import { TSyncStore } from './types'
import { getHashState } from './get-hash-state'

export const locationHash = (store: TSyncStore) => {
  globalObject.addEventListener('hashchange', () => {
    store.setState(
      getHashState()
    )
  })

  store.subscribe((state) => {
    setCurrentHash(encodeUrl(state))
  })
}
