import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { TColor, colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TEntry, TRect } from './types'
import { GraphPoint } from './GraphPoint'
import { MAX_ENTRIES_STEP, OFFSET } from './constants'

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
  })),
  mapWithPropsMemo(({ entries, rect, minValue, halfHeight, halfPathHeight, stepY }) => {
    const step = rect.width / entries.length
    const points = entries.map(({ value }, index) => {
      const x = rect.x + step * index + (step * OFFSET)
      // const y = (1 - ((value - minValue) * 100) / (maxValue - minValue) / 100) * rect.height + rect.y
      // const y = rect.height + rect.y - (value * stepY + halfHeight - halfPathHeight - minValue * stepY)
      const y = rect.height - (value * stepY + halfHeight - halfPathHeight - minValue * stepY) + rect.y

      return {
        x,
        y,
        value,
      }
    })

    return {
      points,
      pointsString: points.map(({ x, y }) => `${x}, ${y}`).join(' '),
    }
  }, ['entries', 'rect', 'minValue', 'halfHeight', 'halfPathHeight', 'stepY'])
)(({
  color,
  id,
  isSelected,
  onSelect,
  points,
  pointsString,
  rect,
  shouldShowTicks,
  onHover,
}) => (
  <Fragment>
    <Animation
      easing={easeInOutCubic}
      time={200}
      values={[isSelected ? 1 : 0.1]}
    >
      {([opacity]) => (
        <path
          opacity={opacity}
          d={`M ${pointsString}`}
          stroke={colorToString(color)}
          fill="none"
          strokeWidth={4}
          onClick={() => {
            onSelect(id)
          }}
          onPointerEnter={() => {
            onHover(id)
          }}
          onPointerLeave={() => {
            onHover(null)
          }}
        />
      )}
    </Animation>
    {shouldShowTicks && points.map((point) => (
      <GraphPoint
        key={`${point.x}-line`}
        x={point.x}
        y={point.y}
        value={Math.round(point.value * 1000) / 1000}
        rect={rect}
      />
    ))}
  </Fragment>
))

Graph.displayName = 'Graph'
