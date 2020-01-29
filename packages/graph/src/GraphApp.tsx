import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry } from './types'
import { GraphPath } from './GraphPath'
import { GraphVerticalAxis } from './GraphVerticalAxis'
import { GraphHorizontalAxis } from './GraphHorizontalAxis'

const PADDING = 20

export type TApp = {
  entries: TEntry[],
  height: number,
  width: number,
}

export const GraphApp = component(
  startWithType<TApp>(),
  mapWithPropsMemo(({ entries, height, width }) => {
    const rect = {
      x: PADDING,
      y: 0,
      width: width - PADDING,
      height: height - PADDING,
    }
    const minValue = Math.min(...entries.map((item) => item.value))
    const maxValue = Math.max(...entries.map((item) => item.value))

    return {
      maxValue,
      minValue,
      rect,
    }
  }, ['entries', 'height', 'width'])
)(({
  entries,
  height,
  maxValue,
  minValue,
  rect,
  width,
}) => (
  <div style={{ border: '2px solid #ccc', padding: '20px' }}>
    <svg width={width} height={height} stroke="black">
      <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill="pink"/>

      <GraphHorizontalAxis
        rect={rect}
        entries={entries}
      />

      <GraphVerticalAxis
        rect={rect}
        maxValue={maxValue}
        minValue={minValue}
      />

      <GraphPath
        rect={rect}
        entries={entries}
        maxValue={maxValue}
      />
    </svg>
  </div>
))

GraphApp.displayName = 'GraphApp'
