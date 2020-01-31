import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry } from './types'
import { GraphPath } from './GraphPath'
import { GraphVerticalAxis } from './GraphVerticalAxis'
import { GraphHorizontalAxis } from './GraphHorizontalAxis'
import { CANVAS_PADDING, MAX_MIN_DIFFERENCE, MAX_ENTRIES_STEP } from './constants'

export type TApp = {
  entries: TEntry[],
  height: number,
  width: number,
}

export const GraphApp = component(
  startWithType<TApp>(),
  mapWithPropsMemo(({ width, height, entries: tempEntries }) => {
    const MAX_ENTRIES = Math.round(height / MAX_ENTRIES_STEP)
    const entries = tempEntries.length > MAX_ENTRIES ? tempEntries.slice(-MAX_ENTRIES) : tempEntries
    const values = entries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxTemp = Math.max(...values)
    const maxValue = (maxTemp * 100 / minValue - 100) < MAX_MIN_DIFFERENCE ? maxTemp * 2 : maxTemp * 1.2

    return {
      entries,
      maxValue,
      rect: {
        x: CANVAS_PADDING,
        y: CANVAS_PADDING,
        width: width - CANVAS_PADDING * 2,
        height: height - CANVAS_PADDING * 2,
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
