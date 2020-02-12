import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { TColor } from 'colorido'
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
  color: TColor,
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
    const minValue = Math.min(...values) // - Math.min(...values) * 0.5
    const maxValue = Math.max(...values) //* 1.5

    return {
      entries,
      maxValue,
      minValue,
    }
  }, ['height', 'entries'])
)(({
  color,
  entries,
  maxValue,
  minValue,
  rect,
  isSelected,
  id,
  shouldShowTicks,
  onSelect,
  onHover,
}) => (
  <Fragment>
    {shouldShowTicks && (
      <GraphVerticalAxis
        rect={rect}
        maxValue={maxValue}
        minValue={minValue}
      />
    )}

    <GraphHorizontalAxis
      rect={rect}
      entries={entries}
    />

    <GraphPath
      isSelected={isSelected}
      id={id}
      color={color}
      shouldShowTicks={shouldShowTicks}
      entries={entries}
      maxValue={maxValue}
      minValue={minValue}
      rect={rect}
      onSelect={onSelect}
      onHover={onHover}
    />
  </Fragment>
))

Graph.displayName = 'Graph'
