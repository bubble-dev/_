import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps } from 'refun'
import { colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TGraphItem } from './types'
import { Point } from './Point'
import { MAX_ENTRIES_STEP, GRAPH_OFFSET, PATH_WIDTH } from './constants'
import { getPastMonthsDate } from './utils'

export const Graph = component(
  startWithType<TGraphItem>(),
  mapDefaultProps({
    shouldShowDots: false,
    isActive: false,
  }),
  mapWithPropsMemo(({ rect, entries }) => {
    // const MAX_ENTRIES = Math.round(rect.width / MAX_ENTRIES_STEP)
    const threeMonthAgoDate = getPastMonthsDate(6)

    let timedEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp * 1000)

      return entryDate <= threeMonthAgoDate
    })

    if (timedEntries.length === 0) {
      timedEntries = entries
    }

    // const entriesCount = Math.ceil(timedEntries.length / MAX_ENTRIES)

    // const slicedEntries = timedEntries.filter((_, index) => {
    //   if (index === 0) {
    //     return true
    //   }

    //   if (entries.length - 1 === index) {
    //     return true
    //   }

    //   return index % entriesCount === 0
    // })

    const values = timedEntries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    return {
      entries: timedEntries,
      maxValue,
      minValue,
      values,
    }
  }, ['rect', 'entries']),
  mapWithProps(({ rect, scale, maxValue, minValue, values }) => ({
    stepX: (rect.width - GRAPH_OFFSET) / (values.length - 1),
    stepY: (rect.height - GRAPH_OFFSET) * scale / 100 / Math.abs(maxValue - minValue),
  })),
  mapWithProps(({ stepY, rect, maxValue, minValue }) => ({
    halfHeight: (rect.height - GRAPH_OFFSET) / 2,
    halfPathHeight: (maxValue - minValue) * stepY / 2,
  })),
  mapWithPropsMemo(({ entries, rect, minValue, halfHeight, halfPathHeight, stepX, stepY }) => {
    const points = entries.map(({ value, version }, index) => {
      const x = rect.x + stepX * index + GRAPH_OFFSET / 2
      const y = rect.height - (value * stepY + halfHeight - halfPathHeight - minValue * stepY) + rect.y - GRAPH_OFFSET / 2

      return {
        x,
        y,
        value,
        version,
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
            points={`${rect.x + GRAPH_OFFSET / 2}, ${rect.height + rect.y - GRAPH_OFFSET / 2} ${pointsString} ${rect.width + rect.x - GRAPH_OFFSET / 2}, ${rect.height + rect.y - GRAPH_OFFSET / 2}`}
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
        <Point
          fill={colors[0]}
          isLast={index === 0}
          isFirst={index === points.length - 1}
          key={`${point.x}-line`}
          version={point.version}
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