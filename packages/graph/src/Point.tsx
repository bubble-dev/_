import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, mapRefLayout, mapWithProps, mapDefaultProps, mapState, mapHandlers, onMount, onChange, onUpdate } from 'refun'
import { colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { POINT_BORDER, POINT_RADIUS, TOOLTIP_FONT_SIZE, TOOLTIP_X_OFFSET, TOOLTIP_Y_OFFSET, TOOLTIP_PADDING, GRAPH_OFFSET } from './constants'
import { TGraphPoint } from './types'

const STATE_CLOSED = 0
const STATE_OPENING = 1
const STATE_OPENED = 2
const STATE_CLOSING = 3

export const Point = component(
  startWithType<TGraphPoint>(),
  mapHovered,
  mapState('state', 'setState', () => STATE_CLOSED, []),
  mapHandlers({
    onAnimationEnd: ({ state, setState }) => () => {
      if (state === STATE_CLOSING) {
        setState(STATE_CLOSED)
      }
    },
  }),
  onUpdate(({ state, shouldShowDots, setState }) => {
    if (state !== STATE_OPENED && shouldShowDots) {
      setState(STATE_OPENING)
    }

    if (state !== STATE_CLOSED && !shouldShowDots) {
      setState(STATE_CLOSING)
    }
  }, ['shouldShowDots']),
  onUpdate(({ state, setState }) => {
    if (state === STATE_OPENING) {
      setState(STATE_OPENED)
    }
  }, ['state']),
  mapDefaultProps({
    isFirst: false,
    isLast: false,
    shouldShowDots: false,
  }),
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
  }, ['state', 'isHovered', 'isLast', 'isFirst']),
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
  fill,
  isFirst,
  isHovered,
  isLast,
  version,
  shouldShowDots,
  textRef,
  tooltip,
  state,
  value,
  valueDifference,
  x,
  y,
  onAnimationEnd,
  onPointerEnter,
  onPointerLeave,
}) => {
  console.log('TCL: state', state)

  if (state === STATE_CLOSED) {
    return null
  }

  // return null
  const isOpened = state === STATE_OPENED

  return (
    <Fragment>
      <Animation
        easing={easeInOutCubic}
        time={1000}
        values={[isHovered || (isOpened && isLast) || (isOpened && isFirst) ? 1 : 0]}
        onAnimationEnd={onAnimationEnd}
      >
        {([opacity]) => (
          <g
            opacity={opacity}
            style={{ pointerEvents: shouldShowDots ? 'auto' : 'none' }}
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
      <Animation
        easing={easeInOutCubic}
        time={1000}
        values={[state === STATE_OPENED ? POINT_RADIUS : 0]}
      >
        {([radius]) => (
          <circle
            cursor="pointer"
            cx={x}
            cy={y}
            fill={colorToString(fill)}
            // opacity={shouldShowDots ? 1 : 0}
            stroke="white"
            strokeWidth={POINT_BORDER}
            r={radius}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          />
        )}
      </Animation>
    </Fragment>
  )
})

Point.displayName = 'Point'
