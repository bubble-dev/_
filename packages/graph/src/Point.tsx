import React from 'react'
import { component, startWithType, mapDefaultProps, mapState, mapHandlers, onUpdate } from 'refun'
import { colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { POINT_BORDER, POINT_RADIUS } from './constants'
import { TGraphPoint } from './types'

const STATE_CLOSED = 0
const STATE_OPENING = 1
const STATE_OPENED = 2
const STATE_CLOSING = 3

type TState = typeof STATE_CLOSED | typeof STATE_OPENING | typeof STATE_OPENED | typeof STATE_CLOSING

export const Point = component(
  startWithType<TGraphPoint>(),
  mapState('state', 'setState', ({ shouldShow }) => (shouldShow ? STATE_OPENED : STATE_CLOSED) as TState, ['shouldShow']),
  mapHandlers({
    onAnimationEnd: ({ state, setState }) => () => {
      if (state === STATE_CLOSING) {
        setState(STATE_CLOSED)
      }
    },
    onPointerEnter: ({ id, onPointerEnter }) => () => {
      onPointerEnter(id)
    },
  }),
  onUpdate(({ state, shouldShow, setState }) => {
    if (state !== STATE_OPENED && shouldShow) {
      setState(STATE_OPENING)
    }

    if (state !== STATE_CLOSED && !shouldShow) {
      setState(STATE_CLOSING)
    }
  }, ['shouldShow']),
  onUpdate(({ state, setState }) => {
    if (state === STATE_OPENING) {
      setState(STATE_OPENED)
    }
  }, ['state']),
  mapDefaultProps({
    shouldShow: false,
  })
)(({
  fill,
  state,
  x,
  y,
  onAnimationEnd,
  onPointerEnter,
  onPointerLeave,
}) => {
  if (state === STATE_CLOSED) {
    return null
  }

  return (
    <Animation
      easing={easeInOutCubic}
      time={300}
      values={[state === STATE_OPENED ? POINT_RADIUS : 0]}
      onAnimationEnd={onAnimationEnd}
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
    </Animation>
  )
})

Point.displayName = 'Point'
