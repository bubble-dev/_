import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { TColor, colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TEntry, TRect } from './types'
import { GraphPoint } from './GraphPoint'
import { MAX_ENTRIES_STEP, POINT_RADIUS, POINT_BORDER, PATH_WIDTH } from './constants'

const OFFSET = POINT_RADIUS + POINT_BORDER + PATH_WIDTH + 10

export type TGraph = {
  colors: TColor[],
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
    const MAX_ENTRIES = Math.round(rect.width / MAX_ENTRIES_STEP)
    const slicedEntries = entries.length > MAX_ENTRIES ? entries.slice(-MAX_ENTRIES) : entries

    const values = slicedEntries.map((item) => item.value)
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
      points: points.slice(0).reverse(),
      pointsString: points.map(({ x, y }) => `${x}, ${y}`).join(' '),
    }
  }, ['entries', 'rect', 'minValue', 'halfHeight', 'halfPathHeight', 'stepX', 'stepY'])
)(({
  colors,
  id,
  isActive,
  onSelect,
  points,
  pointsString,
  shouldShowDots,
  rect,
  onHover,
}) => (
  <Fragment>
    <Animation
      easing={easeInOutCubic}
      time={200}
      values={[
        isActive ? 1 : 0.1,
        shouldShowDots ? 0.15 : 0,
      ]}
    >
      {([pathOpacity, polygonOpacity]) => (
        <Fragment>
          <defs>
            <linearGradient id={`line-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorToString(colors[0])}/>
              <stop offset="100%" stopColor={colorToString(colors[1])}/>
            </linearGradient>
            <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorToString(colors[1])}/>
              <stop offset="100%" stopColor="#1e2730"/>
            </linearGradient>
          </defs>
          <polygon
            style={{ pointerEvents: 'none' }}
            opacity={polygonOpacity}
            points={`${rect.x + OFFSET / 2}, ${rect.height + rect.y - OFFSET / 2} ${pointsString} ${rect.width + rect.x - OFFSET / 2}, ${rect.height + rect.y - OFFSET / 2}`}
            stroke="none"
            fill={`url(#gradient-${id})`}
          />
          <path
            cursor="pointer"
            d={`M ${pointsString}`}
            fill="none"
            opacity={pathOpacity}
            stroke={`url(#line-${id})`}
            strokeLinecap="round"
            strokeLinejoin="round"
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
    {points.map((point, index) => {
      const nextValue = index + 1 < points.length ? points[index + 1].value : 0
      const differenceWithPrePoint = Number(nextValue ? ((point.value - nextValue) / nextValue * 100.0).toFixed(2) : 0)

      return (
        <GraphPoint
          fill={colors[0]}
          key={`${point.x}-line`}
          shouldShowDots={shouldShowDots}
          value={Math.round(point.value * 1000) / 1000}
          valueDifference={differenceWithPrePoint}
          x={point.x}
          y={point.y}
        />
      )
    })}
  </Fragment>
))

Graph.displayName = 'Graph'
