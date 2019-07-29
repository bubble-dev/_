import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { TFile } from './types'

const ENDPOINT = 'http://localhost:3001/get'

type TSnapshotData = string | null

export const Snapshot = component(
  startWithType<TFile>(),
  mapState('state', 'setState', () => null as TSnapshotData, []),
  onMount(({ setState, file, item, type }) => {
    (async () => {
      const response = await fetch(`${ENDPOINT}?file=${encodeURIComponent(file)}&type=${type}&item=${encodeURIComponent(item)}`)
      const data = await response.text()

      setState(data)
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
