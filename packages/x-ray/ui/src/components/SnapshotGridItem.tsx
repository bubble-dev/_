import React from 'react'
import { startWithType, component, mapState, onMount, mapWithPropsMemo } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { elegir } from 'elegir'
import { TColor } from 'colorido'
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
  }),
  mapWithPropsMemo(({ type }) => ({
    borderColor: elegir(
      type === 'new',
      [0, 127, 0, 1] as TColor,
      type === 'diff',
      [0, 0, 127, 1] as TColor,
      true,
      [127, 0, 0, 1] as TColor
    ),
  }), ['type'])
)(({ state, top, left, width, height, borderColor }) => {
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
      <Border
        topWidth={2}
        leftWidth={2}
        rightWidth={2}
        bottomWidth={2}
        overflowTop={2}
        overflowLeft={2}
        overflowRight={2}
        overflowBottom={2}
        color={borderColor}
      />
    </Block>
  )
})
