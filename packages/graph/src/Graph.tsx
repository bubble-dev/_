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
  isActive: boolean,
  rect: TRect,
  scale: number,
  shouldShowDots: boolean,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export const Graph = component(
  startWithType<TGraph>(),
  // TODO add mapDefaultProps
  mapDefaultProps({
    shouldShowDots: false,
    isSelected: false,
  }),
  // TODO values?
  mapWithPropsMemo(({ rect, entries }) => {
    const MAX_ENTRIES = Math.round(rect.height / MAX_ENTRIES_STEP)
    const slicedEntries = entries.length > MAX_ENTRIES ? entries.slice(-MAX_ENTRIES) : entries
    const values = entries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    return {
      entries: slicedEntries,
      maxValue,
      minValue,
      values,
    }
  }, ['rect', 'entries']),
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
  isActive,
  onSelect,
  points,
  pointsString,
  shouldShowDots,
  onHover,
}) => (
  <Fragment>
    <Animation
      easing={easeInOutCubic}
      time={200}
      values={[isActive ? 1 : 0.1]}
    >
      {([opacity]) => (
        <path
          opacity={opacity}
          d={`M ${pointsString}`}
          stroke={colorToString(color)}
          fill="none"
          strokeWidth={8}
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
    {points.map((point) => (
      <GraphPoint
        shouldShowDots={shouldShowDots}
        key={`${point.x}-line`}
        fill={color}
        x={point.x}
        y={point.y}
        value={Math.round(point.value * 1000) / 1000}
      />
    ))}
  </Fragment>
))

Graph.displayName = 'Graph'
