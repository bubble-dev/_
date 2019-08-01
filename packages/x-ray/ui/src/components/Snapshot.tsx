import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'

type TSnapshotData = string | null

export const Snapshot = component(
  startWithType<TApiLoadSnapshotOpts>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TSnapshotData, []),
  onMount(({ setState, file, item, type, dispatch }) => {
    (async () => {
      try {
        const data = await apiLoadSnapshot({ file, item, type })

        setState(data)
      } catch (err) {
        dispatch(actionError(err.message))
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
