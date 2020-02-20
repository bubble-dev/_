import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, mapRefLayout, mapWithProps, mapDefaultProps } from 'refun'
import { colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { POINT_BORDER, POINT_RADIUS, TOOLTIP_FONT_SIZE, TOOLTIP_X_OFFSET, TOOLTIP_Y_OFFSET, TOOLTIP_PADDING, GRAPH_OFFSET } from './constants'
import { TGraphPoint } from './types'

export const Point = component(
  startWithType<TGraphPoint>(),
  mapHovered,
  mapDefaultProps({
    shouldShowDots: false,
    isLast: false,
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
  }, ['shouldShowDots']),
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
  release,
  shouldShowDots,
  textRef,
  tooltip,
  value,
  valueDifference,
  x,
  y,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Fragment>
    <Animation
      easing={easeInOutCubic}
      time={300}
      values={[shouldShowDots ? 1 : 0]}
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
            fill="rgba(255,255,255,0.8)"
          />
          <text
            fontSize={TOOLTIP_FONT_SIZE}
            fontFamily="monospace"
            ref={textRef}
            y={tooltip.textY}
          >
            <tspan x={tooltip.spanX} dy={0}>
              {release}
            </tspan>
            <tspan
              x={tooltip.spanX}
              dy={tooltip.spanY}
            >
              {value}
              {valueDifference ? (
                <tspan
                  fill={valueDifference > 0 ? 'red' : 'green'}
                >({valueDifference > 0 ? `+${valueDifference}` : valueDifference}%)
                </tspan>
              ) : null}
            </tspan>
          </text>
        </g>
      )}
    </Animation>
    <Animation
      easing={easeInOutCubic}
      time={300}
      values={[shouldShowDots ? POINT_RADIUS : 0]}
    >
      {([radius]) => (
        <circle
          cursor="pointer"
          cx={x}
          cy={y}
          fill={colorToString(fill)}
          opacity={shouldShowDots ? 1 : 0}
          stroke="white"
          strokeWidth={POINT_BORDER}
          r={radius}
          onPointerEnter={() => {
            onPointerEnter()
          }}
          onPointerLeave={() => {
            onPointerLeave()
          }}
        />
      )}
    </Animation>
  </Fragment>
))

Point.displayName = 'Point'
