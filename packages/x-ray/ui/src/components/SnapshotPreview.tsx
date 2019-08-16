import React from 'react'
import { component, startWithType, mapState, onMount } from 'refun'
import { elegir } from 'elegir'
import { TFileResultLine } from '@x-ray/snapshots'
import { TRect, TSnapshotGridItem } from '../types'
import { mapStoreDispatch } from '../store'
import { apiLoadSnapshot } from '../api'
import { actionError } from '../actions'
import { Block } from './Block'

export type TSnapshotPreview = TRect & {
  item: TSnapshotGridItem,
}

export const SnapshotPreview = component(
  startWithType<TSnapshotPreview>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onMount(({ setState, item, dispatch }) => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await apiLoadSnapshot(item)

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
)(({ top, left, width, height, state }) => {
  if (state === null) {
    return null
  }

  return (
    <Block top={top} left={left} width={width} height={height} shouldScroll>
      <pre style={{
        fontSize: 14,
        lineHeight: '18px',
        fontFamily: 'monospace',
        width,
        height,
        margin: 0,
      }}
      >
        {state.map((line, i) => (
          <div
            style={{
              backgroundColor: elegir(
                line.type === 'added',
                '#00ff00',
                line.type === 'removed',
                '#ff0000',
                true,
                '#ffffff'
              ),
            }}
            key={i}
          >
            {line.value}
          </div>
        ))}
      </pre>
    </Block>
  )
})
