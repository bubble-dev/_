import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry } from './types'
import { GraphPath } from './GraphPath'
import { GraphVerticalAxis } from './GraphVerticalAxis'
import { GraphHorizontalAxis } from './GraphHorizontalAxis'

export type TApp = {
  entries: TEntry[],
  height: number,
  width: number,
}

const PADDING = 40
const PERCENT = 30

export const GraphApp = component(
  startWithType<TApp>(),
  mapWithPropsMemo(({ width, height, entries }) => {
    const values = entries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxTemp = Math.max(...values)
    const maxValue = (maxTemp * 100 / minValue - 100) < PERCENT ? maxTemp * 2 : maxTemp * 1.2

    return {
      maxValue,
      rect: {
        x: PADDING,
        y: PADDING,
        width: width - PADDING * 2,
        height: height - PADDING * 2,
      },
    }
  }, ['width', 'height', 'entries'])
)(({
  maxValue,
  entries,
  width,
  height,
  rect,
}) => (
  <svg width={width} height={height} stroke="none">
    <rect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      fill="#ffe0e0"
    />

    <GraphHorizontalAxis
      rect={rect}
      entries={entries}
    />

    <GraphVerticalAxis
      rect={rect}
      maxValue={maxValue}
    />

    <GraphPath
      rect={rect}
      entries={entries}
      maxValue={maxValue}
    />

  </svg>
))

GraphApp.displayName = 'GraphApp'
