import { store as mainStore } from '../store/store'
import { store as metaStore } from '../store-meta/store'
import { SyncStoreFactory } from './store'
import { locationHash } from './location-hash'
import { syncState } from './sync-state'

const store = SyncStoreFactory(mainStore, metaStore)

// Activate middlewares
syncState(store)
locationHash(store)
