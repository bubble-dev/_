import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, TMapHovered, mapWithProps } from 'refun'

const POINT_SIZE = 6

export type TGraphPoint = {
  x: number,
  y: number,
  value: number,
} & TMapHovered

export const GraphPoint = component(
  startWithType<TGraphPoint>(),
  mapHovered,
  mapWithProps(({ isHovered }) => ({
    color: isHovered ? 'red' : 'black',
  }))
)(({ x, y, value, onPointerEnter, onPointerLeave, color }) => (
  <Fragment>
    <circle
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      cx={x}
      cy={y}
      r={POINT_SIZE}
      fill={color}
    />
    <text
      x={x + 2}
      y={y - 5}
    > {value}
    </text>
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
