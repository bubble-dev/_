import React from 'react'
import { component, startWithType, mapHandlers } from 'refun'
import { colorToString } from 'colorido'
import { easeInOutCubic } from '@primitives/animation'
import { Animate } from './Animate'
import { POINT_BORDER, POINT_RADIUS } from './constants'
import { TGraphPoint } from './types'

export const Point = component(
  startWithType<TGraphPoint>(),
  mapHandlers({
    onPointerEnter: ({ id, onPointerEnter }) => () => {
      onPointerEnter(id)
    },
  })
)(({
  fill,
  x,
  y,
  shouldShow,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Animate
    easing={easeInOutCubic}
    time={300}
    from={0}
    to={POINT_RADIUS}
    isActive={shouldShow}
  >
    {([radius]) => (
      <circle
        cursor="pointer"
        cx={x}
        cy={y}
        fill={colorToString(fill)}
        stroke="white"
        strokeWidth={POINT_BORDER}
        r={radius}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      />
    )}
  </Animate>
))

Point.displayName = 'Point'
