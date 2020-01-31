import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, TMapHovered, mapWithProps } from 'refun'

const POINT_SIZE = 6

export type TGraphPoint = {
  x: number,
  y: number,
  value: number,
  // TODO move rect to types
  rect: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
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
          stroke="green"
        />
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={rect.height + rect.y}
          stroke="green"
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
