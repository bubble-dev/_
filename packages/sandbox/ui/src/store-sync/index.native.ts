import { store as mainStore } from '../store/store'
import { store as metaStore } from '../store-meta/store'
import { SyncStoreFactory } from './store'
import { syncState } from './sync-state'

const store = SyncStoreFactory(mainStore, metaStore)

syncState(store)
