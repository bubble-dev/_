import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { TOmitKey } from 'tsfn'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { Block } from './Block'
import { TRect } from './types'

type TSnapshotData = string | null

export type TSnapshotNew = TOmitKey<TApiLoadSnapshotOpts, 'type'> & TRect

export const SnapshotNew = component(
  startWithType<TSnapshotNew>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TSnapshotData, []),
  onMount(({ setState, file, props, dispatch }) => {
    (async () => {
      try {
        const data = await apiLoadSnapshot({ file, props, type: 'new' })

        setState(data)
      } catch (err) {
        console.log(err)
        dispatch(actionError(err.message))
      }
    })()
  })
)(({ state, top, left, width, height }) => {
  if (state === null) {
    return null
  }

  return (
    <Block top={top} left={left} width={width} height={height}>
      <pre
        style={{
          border: '1px solid red',
          width: 400,
          height: 400,
          overflow: 'scroll',
          resize: 'both',
        }}
      >
        {state}
      </pre>
    </Block>
  )
})
