import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { TColor } from 'colorido'
import { TEntry, TRect } from './types'
import { GraphPath } from './GraphPath'
import { GraphVerticalAxis } from './GraphVerticalAxis'
import { GraphHorizontalAxis } from './GraphHorizontalAxis'
import { MAX_MIN_DIFFERENCE, MAX_ENTRIES_STEP } from './constants'

export type TGraph = {
  color: TColor,
  entries: TEntry[],
  id: string,
  isSelected: boolean,
  rect: TRect,
  scale: number,
  shouldShowTicks: boolean,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export const Graph = component(
  startWithType<TGraph>(),
  // TODO add mapDefaultProps
  mapDefaultProps({
    shouldShowTicks: false,
    isSelected: false,
  }),
  // TODO values?
  mapWithPropsMemo(({ rect, entries: tempEntries }) => {
    const MAX_ENTRIES = Math.round(rect.height / MAX_ENTRIES_STEP)
    const entries = tempEntries.length > MAX_ENTRIES ? tempEntries.slice(-MAX_ENTRIES) : tempEntries
    const values = entries.map((item) => item.value)
    const minValue = Math.min(...values) // - Math.min(...values) * 0.5
    const maxValue = Math.max(...values) //* 1.5

    return {
      entries,
      maxValue,
      minValue,
      values,
    }
  }, ['height', 'entries']),
  mapWithProps(({ rect, scale, maxValue, minValue, values }) => {
    return {
      stepX: rect.width / (values.length - 1),
      stepY: rect.height * scale / 100 / Math.abs(maxValue - minValue),
    }
  }),
  mapWithProps(({ stepY, rect, maxValue, minValue }) => ({
    halfHeight: rect.height / 2,
    halfPathHeight: (maxValue - minValue) * stepY / 2,
  }))
)(({
  color,
  entries,
  maxValue,
  minValue,
  rect,
  isSelected,
  id,
  shouldShowTicks,
  halfHeight, halfPathHeight, stepX, stepY,
  onSelect,
  onHover,
}) => (
  <Fragment>
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
      halfHeight={halfHeight}
      halfPathHeight={halfPathHeight}
      stepX={stepX}
      stepY={stepY}
    />
  </Fragment>
))

Graph.displayName = 'Graph'
