import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { loadSnapshotApi, TLoadSnapshotApiOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { errorAction } from '../actions'

type TSnapshotData = string | null

export const Snapshot = component(
  startWithType<TLoadSnapshotApiOpts>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TSnapshotData, []),
  onMount(({ setState, file, item, type, dispatch }) => {
    (async () => {
      try {
        const data = await loadSnapshotApi({ file, item, type })

        setState(data)
      } catch (err) {
        dispatch(errorAction(err.message))
      }
    })()
  })
)(({ state }) => (
  state === null
    ? null
    : (
      <pre
        style={{
          border: '1px solid red',
          width: 400,
          height: 50,
          overflow: 'scroll',
          resize: 'both',
        }}
      >
        {state}
      </pre>
    )
))
