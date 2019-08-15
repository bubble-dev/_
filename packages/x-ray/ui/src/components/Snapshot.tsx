import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { elegir } from 'elegir'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from '../types'
import { Block } from './Block'

export type TSnapshot = TApiLoadSnapshotOpts & TRect

export const Snapshot = component(
  startWithType<TSnapshot>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onMount(({ setState, file, id, type, dispatch }) => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await apiLoadSnapshot({ file, id, type })

        if (isMounted) {
          setState(data)
        }
      } catch (err) {
        console.log(err)
        dispatch(actionError(err.message))
      }
    })()

    return () => {
      isMounted = false
    }
  })
)(({ state, top, left, width, height }) => {
  if (state === null) {
    return null
  }

  return (
    <Block top={top} left={left} width={width} height={height}>
      <pre
        style={{
          fontSize: 4,
          lineHeight: '6px',
          fontFamily: 'monospace',
          border: '1px solid red',
          width,
          height,
          overflow: 'scroll',
        }}
      >
        {state.map((item, i) => (
          <div
            style={{
              backgroundColor: elegir(
                item.type === 'added',
                '#00ff00',
                item.type === 'removed',
                '#ff0000',
                true,
                '#ffffff'
              ),
            }}
            key={i}
          >
            {item.value}
          </div>
        ))}
      </pre>
    </Block>
  )
})
