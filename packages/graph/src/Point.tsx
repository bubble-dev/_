import React from 'react'
import { component, startWithType, mapDefaultProps, mapHandlers } from 'refun'
import { colorToString } from 'colorido'
import { easeInOutCubic } from '@primitives/animation'
import { Animate } from './Animate'
import { POINT_BORDER, POINT_RADIUS } from './constants'
import { TGraphPoint } from './types'

export const Point = component(
  startWithType<TGraphPoint>(),
  mapDefaultProps({
    shouldShow: false,
  }),
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
}) => {
  return (
    <Animate
      easing={easeInOutCubic}
      time={1000}
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
  )
})

Point.displayName = 'Point'
