import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo, TMapHovered, mapHovered } from 'refun'
import { TEntry, TRect } from './types'
import { OFFSET } from './constants'
import { GraphPoint } from './GraphPoint'

export type TGraphPath = {
  color: string,
  entries: TEntry[],
  hoverColor: string | null,
  maxValue: number,
  rect: TRect,
} & TMapHovered

export const GraphPath = component(
  startWithType<TGraphPath>(),
  mapHovered,
  mapWithPropsMemo(({ entries, rect, maxValue }) => {
    const step = rect.width / entries.length
    const points = entries.map(({ value }, index) => {
      return {
        x: rect.x + step * index + (step * OFFSET),
        y: (1 - (value * 100) / maxValue / 100) * rect.height + rect.y,
        value,
      }
    })

    return {
      points,
      pointsString: points.map(({ x, y }) => `${x}, ${y}`).join(' '),
    }
  }, ['entries', 'rect', 'maxValue'])
)(({
  color,
  points,
  pointsString,
  rect,
  onPathEnter,
  onPathLeave,
  hoverColor,
  onActivePath,
  index,
  isActiveGraph,
}) => {
  return (
    <Fragment>
      <path
        d={`M ${pointsString}`}
        stroke={hoverColor ? hoverColor : color}
        fill="none"
        strokeWidth="3"
        onPointerEnter={() => {
          // TODO rename index to name
          onActivePath(index)
        }}
        onPointerLeave={() => {
          onActivePath()
        }}
      />
      {/* {isActiveGraph && points.map((point) => (
        <GraphPoint
          key={`${point.x}-line`}
          x={point.x}
          y={point.y}
          value={point.value}
          rect={rect}
        />
      ))} */}
    </Fragment>
  )
})

GraphPath.displayName = 'GraphPath'
