import { globalObject } from '../utils'
import { getCurrentHash, decodeUrl, encodeUrl, setCurrentHash, EMPTY_HASH } from '../store/utils'
import { TSyncStore } from './types'

export const locationHash = (store: TSyncStore) => {
  let prevHash = EMPTY_HASH

  globalObject.addEventListener('hashchange', () => {
    const hash = getCurrentHash()

    if (hash === prevHash) {
      return
    }

    prevHash = hash

    store.setState(
      hash === EMPTY_HASH
        ? store.getInitialState()
        : decodeUrl(hash)
    )
  })

  store.subscribe((state) => {
    prevHash = encodeUrl(state)

    setCurrentHash(prevHash)
  })
}
