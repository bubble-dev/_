import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, TMapHovered, mapWithProps } from 'refun'
import { TRect } from './types'
import { POINT_SIZE } from './constants'

export type TGraphPoint = {
  x: number,
  y: number,
  value: number,
  rect: TRect,
} & TMapHovered

export const GraphPoint = component(
  startWithType<TGraphPoint>(),
  mapHovered,
  mapWithProps(({ isHovered }) => ({
    color: isHovered ? 'red' : 'black',
  }))
)(({
  color,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  value,
  x,
  y,
  rect,
}) => (
  <Fragment>
    {isHovered && (
      <Fragment>
        <line
          x1={rect.x}
          y1={y}
          x2={x}
          y2={y}
          strokeWidth={2}
          stroke="grey"
        />
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={rect.height + rect.y}
          strokeWidth={2}
          stroke="grey"
        />
        <text
          x={x + 2}
          y={y - 5}
        > {value}
        </text>
      </Fragment>
    )}
    <circle
      cx={x}
      cy={y}
      fill={color}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      r={isHovered ? POINT_SIZE + 1 : POINT_SIZE}
    />
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
