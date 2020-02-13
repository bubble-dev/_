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
  shouldShowDots: boolean,
} & TMapHovered

export const GraphPoint = component(
  startWithType<TGraphPoint>(),
  mapHovered
)(({
  fill,
  isHovered,
  shouldShowDots,
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
        {/* <rect
          x="50"
          y="20"
          rx="20"
          ry="20"
          width="150"
          height="150"
          style="fill:red;stroke:black;stroke-width:5;opacity:0.5"
        /> */}
      </Fragment>
    )}
    <Animation
      easing={easeInOutCubic}
      time={300}
      values={[shouldShowDots ? POINT_SIZE : 0]}
    >
      {(radius) => (
        <Animation
          easing={easeInOutCubic}
          time={200}
          values={isHovered ? [255, 255, 255, 1] : fill}
        >
          {(color) => (
            <circle
              opacity={shouldShowDots ? 1 : 0}
              cursor="pointer"
              cx={x}
              cy={y}
              fill={colorToString(color as TColor)}
              stroke="white"
              strokeWidth={6}
              onPointerEnter={() => {
                onPointerEnter()
              }}
              onPointerLeave={() => {
                onPointerLeave()
              }}
              r={radius}
            />
          )}
        </Animation>
      )}

    </Animation>
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
