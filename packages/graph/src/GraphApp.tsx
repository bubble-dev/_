import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo, mapHovered, mapWithProps, TMapHovered, mapState, mapHandlers } from 'refun'
import { TEntry, TRect } from './types'
import { GraphPath } from './GraphPath'
import { GraphVerticalAxis } from './GraphVerticalAxis'
import { GraphHorizontalAxis } from './GraphHorizontalAxis'
import { CANVAS_PADDING, MAX_MIN_DIFFERENCE, MAX_ENTRIES_STEP } from './constants'

export type TApp = {
  entries: TEntry[],
  height: number,
  width: number,
  color: string,
  rect: TRect,
}

export const GraphApp = component(
  startWithType<TApp>(),
  mapWithPropsMemo(({ height, entries: tempEntries }) => {
    const MAX_ENTRIES = Math.round(height / MAX_ENTRIES_STEP)
    const entries = tempEntries.length > MAX_ENTRIES ? tempEntries.slice(-MAX_ENTRIES) : tempEntries
    const values = entries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxTemp = Math.max(...values)
    const maxValue = (maxTemp * 100 / minValue - 100) < MAX_MIN_DIFFERENCE ? maxTemp * 2 : maxTemp * 1.2

    return {
      entries,
      maxValue,
    }
  }, ['height', 'entries'])
)(({
  color,
  entries,
  height,
  maxValue,
  rect,
  width,
  onPathEnter,
  onPathLeave,
  hoverColor,
  onActivePath,
  index,
  showXY,
  isActiveGraph,
}) => (
  <Fragment>
    {showXY && (
      <Fragment>
        <GraphHorizontalAxis
          rect={rect}
          entries={entries}
        />

        <GraphVerticalAxis
          rect={rect}
          maxValue={maxValue}
        />
      </Fragment>
    )}

    <GraphPath
      isActiveGraph={isActiveGraph}
      index={index}
      color={color}
      entries={entries}
      hoverColor={hoverColor}
      maxValue={maxValue}
      rect={rect}
      onActivePath={onActivePath}
    />
  </Fragment>
))

GraphApp.displayName = 'GraphApp'
