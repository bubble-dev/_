import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, TMapHovered, mapWithProps } from 'refun'
import { TColor, colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TRect } from './types'
import { POINT_SIZE } from './constants'

export type TGraphPoint = {
  x: number,
  y: number,
  fill: TColor,
  value: number,
} & TMapHovered

export const GraphPoint = component(
  startWithType<TGraphPoint>(),
  mapHovered
)(({
  fill,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  value,
  x,
  y,
}) => (
  <Fragment>
    {isHovered && (
      <Fragment>
        <text
          x={x + 2}
          y={y - 5}
        > {value}
        </text>
      </Fragment>
    )}
    {/* // TODO z-indx for circles */}
    <Animation
      easing={easeInOutCubic}
      time={200}
      values={isHovered ? [255, 255, 255, 1] : fill}
    >
      {(color) => (
        <circle
          cursor="pointer"
          cx={x}
          cy={y}
          fill={colorToString(color as TColor)}
          stroke="white"
          strokeWidth={4}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          r={POINT_SIZE}
        />
      )}
    </Animation>
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
