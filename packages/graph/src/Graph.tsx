import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps, mapState, mapHandlers } from 'refun'
import { colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TGraphItem } from './types'
import { Point } from './Point'
import { Tooltip } from './Tooltip'
import { GRAPH_OFFSET, PATH_WIDTH } from './constants'
import { getPastMonthsDate } from './utils'

export const Graph = component(
  startWithType<TGraphItem>(),
  mapDefaultProps({
    shouldShowDots: false,
    isActive: false,
  }),
  mapWithPropsMemo(({ entries, monthsAgo }) => {
    const monthsAgoDate = getPastMonthsDate(monthsAgo)

    let timedEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp * 1000)

      return entryDate >= monthsAgoDate
    })

    if (timedEntries.length === 0) {
      timedEntries = entries
    }

    const values = timedEntries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    return {
      entries: timedEntries,
      maxValue,
      minValue,
      values,
    }
  }, ['entries', 'monthsAgo']),
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
  }, ['entries', 'rect', 'minValue', 'halfHeight', 'halfPathHeight', 'stepX', 'stepY']),
  mapState('activePoint', 'setActivePoint', () => null as string | null, []),
  mapHandlers({
    onPointerEnter: ({ setActivePoint }) => (id) => {
      setActivePoint(id)
    },
    onPointerLeave: ({ setActivePoint }) => () => {
      setActivePoint(null)
    },
  })
)(({
  activePoint,
  colors,
  id,
  isActive,
  onSelect,
  points,
  pointsString,
  rect,
  shouldShowDots,
  onHover,
  onPointerEnter,
  onPointerLeave,
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
      const keyID = `${point.x}-graph-data`

      return (
        <Fragment key={keyID}>
          <Point
            fill={colors[0]}
            id={keyID}
            shouldShowDots={shouldShowDots}
            value={Math.round(point.value * 1000) / 1000}
            valueDifference={differenceWithPrePoint}
            version={point.version}
            x={point.x}
            y={point.y}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          />
          <Tooltip
            isActive={activePoint === keyID}
            isFirst={index === points.length - 1}
            isLast={index === 0}
            shouldShow={shouldShowDots}
            value={Math.round(point.value * 1000) / 1000}
            valueDifference={differenceWithPrePoint}
            version={point.version}
            x={point.x}
            y={point.y}
          />
        </Fragment>
      )
    })}
  </Fragment>
))

Graph.displayName = 'Graph'
