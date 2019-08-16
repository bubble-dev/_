import React from 'react'
import { startWithType, component, mapState, onMount } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { elegir } from 'elegir'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from '../types'
import { SNAPSHOT_GRID_FONT_SIZE, SNAPSHOT_GRID_LINE_HEIGHT } from '../config'
import { Block } from './Block'
import { Border } from './Border'

export type TSnapshotGridItem = TApiLoadSnapshotOpts & TRect

export const SnapshotGridItem = component(
  startWithType<TSnapshotGridItem>(),
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
          fontSize: SNAPSHOT_GRID_FONT_SIZE,
          lineHeight: `${SNAPSHOT_GRID_LINE_HEIGHT}px`,
          fontFamily: 'monospace',
          width,
          height,
          margin: 0,
          overflow: 'hidden',
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
      <Border
        topWidth={2}
        leftWidth={2}
        rightWidth={2}
        bottomWidth={2}
        overflowTop={2}
        overflowLeft={2}
        overflowRight={2}
        overflowBottom={2}
        color={[0, 127, 0, 1]}
      />
    </Block>
  )
})
