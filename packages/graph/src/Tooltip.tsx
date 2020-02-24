import React from 'react'
import { component, startWithType, mapRefLayout, mapWithProps, mapDefaultProps, mapState, mapHandlers, onUpdate, onMount } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TOOLTIP_FONT_SIZE, TOOLTIP_X_OFFSET, TOOLTIP_Y_OFFSET, TOOLTIP_PADDING, GRAPH_OFFSET } from './constants'
import { TTooltip } from './types'

const STATE_CLOSED = 0
const STATE_OPENING = 1
const STATE_OPENED = 2
const STATE_CLOSING = 3

export const Tooltip = component(
  startWithType<TTooltip>(),
  mapDefaultProps({
    isActive: false,
    isFirst: false,
    isLast: false,
    shouldShow: false,
  }),
  mapState('state', 'setState', () => STATE_CLOSED, []),
  mapHandlers({
    onAnimationEnd: ({ state, setState }) => () => {
      if (state === STATE_CLOSING) {
        setState(STATE_CLOSED)
      }
    },
  }),
  onUpdate(({ state, isActive, setState, isFirst, isLast, shouldShow }) => {
    const shouldOpen = isActive || isFirst || isLast

    if (state !== STATE_OPENED && shouldShow && shouldOpen) {
      setState(STATE_OPENING)
    }

    if (state !== STATE_CLOSED && !(shouldShow && shouldOpen)) {
      setState(STATE_CLOSING)
    }
  }, ['isActive', 'isFirst', 'isLast', 'shouldShow']),
  onUpdate(({ state, setState }) => {
    if (state === STATE_OPENING) {
      setState(STATE_OPENED)
    }
  }, ['state']),
  mapRefLayout('textRef', (ref) => {
    if (ref !== null) {
      const bBox = ref.getBBox()

      return {
        textWidth: bBox.width,
        textHeight: bBox.height,
      }
    }

    return {
      textWidth: 0,
      textHeight: 0,
    }
  }, ['state', 'shouldShow']),
  mapWithProps(({ y, textHeight }) => {
    const isTop = y < textHeight + TOOLTIP_PADDING * 2 - TOOLTIP_Y_OFFSET + GRAPH_OFFSET

    return {
      isTop,
    }
  }),
  mapWithProps(({
    isLast,
    isTop,
    textHeight,
    textWidth,
    x,
    y,
  }) => {
    const box = {
      x: (isLast
        ? x - textWidth - TOOLTIP_X_OFFSET - TOOLTIP_PADDING * 2
        : x + TOOLTIP_X_OFFSET),
      y: (isTop
        ? y + TOOLTIP_Y_OFFSET - 4
        : y - textHeight + 4 - TOOLTIP_Y_OFFSET - TOOLTIP_PADDING * 2),
      width: textWidth + TOOLTIP_PADDING * 2,
      height: textHeight + TOOLTIP_PADDING * 2,
    }

    const textY = isTop
      ? y + TOOLTIP_Y_OFFSET + TOOLTIP_PADDING + TOOLTIP_FONT_SIZE - 6
      : y - TOOLTIP_Y_OFFSET - TOOLTIP_PADDING - TOOLTIP_FONT_SIZE - 4

    const spanX = isLast
      ? x - textWidth - TOOLTIP_X_OFFSET - TOOLTIP_PADDING
      : x + TOOLTIP_X_OFFSET + TOOLTIP_PADDING

    const spanY = TOOLTIP_FONT_SIZE + 4

    return {
      tooltip: {
        box,
        textY,
        spanX,
        spanY,
      },
    }
  })
)(({
  isActive,
  isFirst,
  isLast,
  version,
  textRef,
  tooltip,
  state,
  value,
  valueDifference,
  onAnimationEnd,
}) => {
  console.log('TCL: state', state)

  if (state === STATE_CLOSED) {
    return null
  }

  return (
    <Animation
      easing={easeInOutCubic}
      time={1000}
      values={[state === STATE_OPENED ? 1 : 0]}
      onAnimationEnd={onAnimationEnd}
    >
      {([opacity]) => (
        <g
          opacity={opacity}
          style={{ pointerEvents: (isActive || isFirst || isLast) ? 'auto' : 'none' }}
        >
          <rect
            x={tooltip.box.x}
            y={tooltip.box.y}
            rx="4"
            ry="4"
            width={tooltip.box.width}
            height={tooltip.box.height}
            fill="rgba(255, 255, 255, 0.8)"
          />
          <text fontSize={TOOLTIP_FONT_SIZE} fontFamily="monospace" ref={textRef} y={tooltip.textY}>
            <tspan x={tooltip.spanX} dy={0}>
              {version}
            </tspan>
            <tspan x={tooltip.spanX} dy={tooltip.spanY}>
              {value}
              {valueDifference ? (
                <tspan fill={valueDifference > 0 ? 'red' : 'green'}>({valueDifference > 0 ? `+${valueDifference}` : valueDifference}%)
                </tspan>
              ) : null}
            </tspan>
          </text>
        </g>
      )}
    </Animation>
  )
})

Tooltip.displayName = 'Tooltip'
