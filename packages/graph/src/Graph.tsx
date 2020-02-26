import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps, mapState, mapHandlers } from 'refun'
import { TGraphItem } from './types'
import { Tooltip } from './Tooltip'
import { Point } from './Point'
import { GRAPH_OFFSET } from './constants'
import { getPastMonthsDate } from './utils'
import { Polygon } from './Polygon'
import { Path } from './Path'

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
  mapWithProps(({ width, height, scale, maxValue, minValue, values }) => ({
    stepX: (width - GRAPH_OFFSET * 2) / (values.length - 1),
    stepY: (height - GRAPH_OFFSET * 2) * scale / 100 / Math.abs(maxValue - minValue),
  })),
  mapWithProps(({ height, stepY, maxValue, minValue }) => ({
    halfHeight: (height - GRAPH_OFFSET * 2) / 2,
    halfPathHeight: (maxValue - minValue) * stepY / 2,
  })),
  mapWithPropsMemo(({ height, entries, minValue, halfHeight, halfPathHeight, stepX, stepY }) => {
    const points = entries.map(({ value, version }, index) => {
      const x = stepX * index + GRAPH_OFFSET
      const y = height - (value * stepY + halfHeight - halfPathHeight - minValue * stepY) - GRAPH_OFFSET

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
  }, ['entries', 'minValue', 'halfHeight', 'halfPathHeight', 'stepX', 'stepY', 'height']),
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
  isHovered,
  onSelect,
  points,
  pointsString,
  width,
  height,
  onHover,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Fragment>
    <Polygon
      isActive={isActive}
      id={id}
      colors={colors}
      points={`${GRAPH_OFFSET}, ${height - GRAPH_OFFSET} ${pointsString} ${width - GRAPH_OFFSET}, ${height - GRAPH_OFFSET}`}
    />
    <Path
      points={pointsString}
      colors={colors}
      isActive={isHovered}
      id={id}
      onHover={onHover}
      onSelect={onSelect}
    />
    {points.map((point, index) => {
      const nextValue = index + 1 < points.length ? points[index + 1].value : 0
      const differenceWithPrePoint = Number(nextValue ? ((point.value - nextValue) / nextValue * 100.0).toFixed(2) : 0)
      const keyID = `${point.x}-graph-data`

      return (
        <Fragment key={keyID}>
          <Point
            fill={colors[0]}
            id={keyID}
            shouldShow={isActive}
            x={point.x}
            y={point.y}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          />
          <Tooltip
            isActive={isActive && (index === points.length - 1 || index === 0 || activePoint === keyID)}
            value={Math.round(point.value * 1000) / 1000}
            valueDifference={differenceWithPrePoint}
            version={point.version}
            x={point.x}
            y={point.y}
            viewportRight={width - GRAPH_OFFSET}
            viewportTop={GRAPH_OFFSET}
          />
        </Fragment>
      )
    })}
  </Fragment>
))

Graph.displayName = 'Graph'
