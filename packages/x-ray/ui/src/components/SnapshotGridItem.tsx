import React from 'react'
import { startWithType, mapState, onMount, mapWithPropsMemo, pureComponent } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { elegir } from 'elegir'
import { TColor } from 'colorido'
import { Text } from '@primitives/text'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from '../types'
import { SNAPSHOT_GRID_FONT_SIZE, SNAPSHOT_GRID_LINE_HEIGHT } from '../config'
import { Block } from './Block'
import { Border } from './Border'
import { Background } from './Background'
import { LINE_HEIGHT } from './SourceCode/constants'

export type TSnapshotGridItem = TApiLoadSnapshotOpts & TRect & {
  isDiscarded: boolean,
}

export const SnapshotGridItem = pureComponent(
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
)(({ state, top, left, width, height, borderColor, isDiscarded }) => {
  if (state === null) {
    return null
  }

  return (
    <Block top={top} left={left} width={width} height={height} opacity={isDiscarded ? 0.5 : 1}>
      {state.map((line, i) => (
        <Block
          top={i * SNAPSHOT_GRID_LINE_HEIGHT}
          height={SNAPSHOT_GRID_LINE_HEIGHT}
          width={width}
          key={i}
        >
          {line.type === 'added' && (
            <Background color={[127, 255, 127, 1]}/>
          )}
          {line.type === 'removed' && (
            <Background color={[255, 127, 127, 1]}/>
          )}
          <Block height={LINE_HEIGHT}>
            <Text
              fontFamily="monospace"
              fontSize={SNAPSHOT_GRID_FONT_SIZE}
              lineHeight={SNAPSHOT_GRID_LINE_HEIGHT}
              shouldPreserveWhitespace
            >
              {line.value}
            </Text>
          </Block>
        </Block>
      ))}
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

SnapshotGridItem.displayName = 'SnapshotGridItem'
