import React, { Fragment, FC } from 'react'
import { colorToString } from 'colorido'
import { easeInOutCubic } from '@primitives/animation'
import { Animate } from './Animate'
import { POINT_BORDER, POINT_RADIUS } from './constants'
import { TGraphPoints } from './types'

export const Points: FC<TGraphPoints> = ({
  fill,
  isActive,
  points,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Animate
    easing={easeInOutCubic}
    time={300}
    from={0}
    to={POINT_RADIUS}
    isActive={isActive}
  >
    {([radius]) => (
      <Fragment>
        {points.map((point) => {
          const keyID = `${point.x}-graph-data`

          return (
            <circle
              key={keyID}
              cursor="pointer"
              cx={point.x}
              cy={point.y}
              fill={colorToString(fill)}
              stroke="white"
              strokeWidth={POINT_BORDER}
              r={radius}
              onPointerEnter={() => {
                onPointerEnter(keyID)
              }}
              onPointerLeave={() => {
                onPointerLeave()
              }}
            />
          )
        })}
      </Fragment>
    )}
  </Animate>
)

Points.displayName = 'Points'
