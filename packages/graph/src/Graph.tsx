import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { TColor, colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TEntry, TRect } from './types'
import { GraphPoint } from './GraphPoint'
import { MAX_ENTRIES_STEP, POINT_RADIUS, POINT_BORDER, PATH_WIDTH } from './constants'

const OFFSET = POINT_RADIUS + POINT_BORDER + PATH_WIDTH + 10

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
  mapWithProps(({ rect, scale, maxValue, minValue, values }) => ({
    stepX: (rect.width - OFFSET) / (values.length - 1),
    stepY: (rect.height - OFFSET) * scale / 100 / Math.abs(maxValue - minValue),
  })),
  mapWithProps(({ stepY, rect, maxValue, minValue }) => ({
    halfHeight: (rect.height - OFFSET) / 2,
    halfPathHeight: (maxValue - minValue) * stepY / 2,
  })),
  mapWithPropsMemo(({ entries, rect, minValue, halfHeight, halfPathHeight, stepX, stepY }) => {
    const points = entries.map(({ value }, index) => {
      const x = rect.x + stepX * index + OFFSET / 2
      const y = rect.height - (value * stepY + halfHeight - halfPathHeight - minValue * stepY) + rect.y - OFFSET / 2

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
        <Fragment>
          <defs>
            <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorToString(color)}/>
              <stop offset="100%" stopColor={colorToString(color)}/>
            </linearGradient>
          </defs>
          <path
            opacity={opacity}
            d={`M ${pointsString}`}
            stroke={`url(#gradient-${id})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeWidth={PATH_WIDTH}
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
        </Fragment>
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
