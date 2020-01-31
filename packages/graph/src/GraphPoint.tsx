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
)(({
  color,
  onPointerEnter,
  onPointerLeave,
  value,
  x,
  y,
}) => (
  <Fragment>
    <circle
      cx={x}
      cy={y}
      fill={color}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      r={POINT_SIZE}
    />
    <text
      x={x + 2}
      y={y - 5}
    > {value}
    </text>
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
