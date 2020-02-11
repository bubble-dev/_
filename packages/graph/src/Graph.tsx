import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo, mapHovered, mapWithProps, TMapHovered, mapState, mapHandlers, mapDefaultProps } from 'refun'
import { TEntry, TRect } from './types'
import { GraphPath } from './GraphPath'
import { GraphVerticalAxis } from './GraphVerticalAxis'
import { GraphHorizontalAxis } from './GraphHorizontalAxis'
import { MAX_MIN_DIFFERENCE, MAX_ENTRIES_STEP } from './constants'

export type TGraph = {
  entries: TEntry[],
  height: number,
  id: string,
  width: number,
  color: string,
  shouldShowTicks: boolean,
  rect: TRect,
  isSelected: boolean,
  onSelect: (key: string) => void,
  onHover: (key: string | null) => void,
}

export const Graph = component(
  startWithType<TGraph>(),
  // TODO add mapDefaultProps
  mapDefaultProps({
    shouldShowTicks: false,
    isSelected: false,
  }),
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
  maxValue,
  rect,
  isSelected,
  id,
  shouldShowTicks,
  onSelect,
  onHover,
}) => (
  <Fragment>
    {shouldShowTicks && (
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
      isSelected={isSelected}
      id={id}
      color={color}
      shouldShowTicks={shouldShowTicks}
      entries={entries}
      maxValue={maxValue}
      rect={rect}
      onSelect={onSelect}
      onHover={onHover}
    />
  </Fragment>
))

Graph.displayName = 'Graph'
