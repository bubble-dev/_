import React from 'react'
import { startWithType, mapState, onMount, mapWithPropsMemo, pureComponent } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { elegir } from 'elegir'
import { TColor } from 'colorido'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from '../types'
import { SNAPSHOT_GRID_FONT_SIZE, SNAPSHOT_GRID_LINE_HEIGHT, COLOR_BORDER_NEW, COLOR_BORDER_DIFF, COLOR_BORDER_DELETED, COLOR_LINE_BG_ADDED, COLOR_LINE_BG_REMOVED, DISCARD_ALPHA, BORDER_WIDTH } from '../config'
import { Text } from './Text'
import { Block } from './Block'
import { Border } from './Border'
import { Background } from './Background'

export type TSnapshotGridItem = TApiLoadSnapshotOpts & TRect & {
  isDiscarded: boolean,
}

export const SnapshotGridItem = pureComponent(
  startWithType<TSnapshotGridItem>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onMount(({ setState, id, type, dispatch }) => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await apiLoadSnapshot({ id, type })

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
      COLOR_BORDER_NEW as TColor,
      type === 'diff',
      COLOR_BORDER_DIFF as TColor,
      true,
      COLOR_BORDER_DELETED as TColor
    ),
  }), ['type'])
)(({ state, top, left, width, height, borderColor, isDiscarded }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      cursor: 'pointer',
    }}
  >
    {state !== null && state.map((line, i) => (
      <Block
        top={i * SNAPSHOT_GRID_LINE_HEIGHT}
        height={SNAPSHOT_GRID_LINE_HEIGHT}
        width={width}
        key={i}
      >
        {line.type === 'added' && (
          <Background color={COLOR_LINE_BG_ADDED}/>
        )}
        {line.type === 'removed' && (
          <Background color={COLOR_LINE_BG_REMOVED}/>
        )}
        <Text
          fontFamily="monospace"
          fontSize={SNAPSHOT_GRID_FONT_SIZE}
          lineHeight={SNAPSHOT_GRID_LINE_HEIGHT}
          shouldPreserveWhitespace
          shouldPreventSelection
        >
          {line.value}
        </Text>
      </Block>
    ))}
    <Border
      topWidth={BORDER_WIDTH}
      leftWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      overflowTop={BORDER_WIDTH}
      overflowLeft={BORDER_WIDTH}
      overflowRight={BORDER_WIDTH}
      overflowBottom={BORDER_WIDTH}
      color={borderColor}
    />
  </Block>
))

SnapshotGridItem.displayName = 'SnapshotGridItem'
