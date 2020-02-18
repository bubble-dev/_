import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, TMapHovered, mapRefLayout, mapWithProps } from 'refun'
import { TColor, colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { POINT_BORDER, POINT_RADIUS, TOOLTIP_FONT_SIZE, TOOLTIP_X_OFFSET, TOOLTIP_Y_OFFSET, TOOLTIP_PADDING, GRAPH_OFFSET } from './constants'

export type TGraphPoint = {
  fill: TColor,
  isLast: boolean,
  shouldShowDots: boolean,
  value: number,
  valueDifference: number,
  x: number,
  y: number,
} & TMapHovered

export const GraphPoint = component(
  startWithType<TGraphPoint>(),
  mapHovered,
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
  })
)(({
  fill,
  isLast,
  isTop,
  shouldShowDots,
  textHeight,
  textRef,
  textWidth,
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
            x={isLast
              ? x - textWidth - TOOLTIP_X_OFFSET - TOOLTIP_PADDING * 2
              : x + TOOLTIP_X_OFFSET
            }
            y={
              isTop
                ? y + TOOLTIP_Y_OFFSET - 4
                : y - textHeight + 4 - TOOLTIP_Y_OFFSET - TOOLTIP_PADDING * 2
              }
            rx="4"
            ry="4"
            width={textWidth + TOOLTIP_PADDING * 2}
            height={textHeight + TOOLTIP_PADDING * 2}
            fill="rgba(255,255,255,0.8)"
          />
          <text
            fontSize={TOOLTIP_FONT_SIZE}
            fontFamily="monospace"
            ref={textRef}
            x={isLast
              ? x - 50
              : x + TOOLTIP_X_OFFSET + TOOLTIP_PADDING
              }
            y={isTop
              ? y + TOOLTIP_Y_OFFSET + TOOLTIP_PADDING + TOOLTIP_FONT_SIZE - 6
              : y - TOOLTIP_Y_OFFSET - TOOLTIP_PADDING - TOOLTIP_FONT_SIZE - 4
              }
          >
            <tspan
              x={isLast
                ? x - textWidth - TOOLTIP_X_OFFSET - TOOLTIP_PADDING
                : x + TOOLTIP_X_OFFSET + TOOLTIP_PADDING
              }
              dy={0}
            >v1.1.1
            </tspan>
            <tspan
              x={isLast
                ? x - textWidth - TOOLTIP_X_OFFSET - TOOLTIP_PADDING
                : x + TOOLTIP_X_OFFSET + TOOLTIP_PADDING
                }
              dy={TOOLTIP_FONT_SIZE + 4}
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
          opacity={shouldShowDots ? 1 : 0}
          cursor="pointer"
          cx={x}
          cy={y}
          fill={isTop ? 'red' : colorToString(fill)}
          stroke="white"
          strokeWidth={POINT_BORDER}
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
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
