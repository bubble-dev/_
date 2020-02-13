import React, { Fragment } from 'react'
import { component, startWithType, mapHovered, TMapHovered, mapRefLayout } from 'refun'
import { TColor, colorToString } from 'colorido'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { POINT_BORDER, POINT_RADIUS, TOOLTIP_FONT_SIZE, TOOLTIP_X_OFFSET, TOOLTIP_Y_OFFSET, TOOLTIP_PADDING } from './constants'

export type TGraphPoint = {
  x: number,
  y: number,
  fill: TColor,
  value: number,
  shouldShowDots: boolean,
} & TMapHovered

export const GraphPoint = component(
  startWithType<TGraphPoint>(),
  mapHovered,
  mapRefLayout('textRef', (ref) => {
    console.log('TCL: ref', ref)

    if (ref !== null) {
      const bBox = ref.getBBox()

      console.log('TCL: bBox', bBox)

      return {
        textWidth: bBox.width,
        textHeight: bBox.height,
      }
    }

    return {
      textWidth: 0,
      textHeight: 0,
    }
  }, ['shouldShowDots'])
)(({
  fill,
  isHovered,
  shouldShowDots,
  textRef,
  value,
  textWidth,
  textHeight,
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
        <g opacity={opacity}>
          <rect
            x={x + TOOLTIP_X_OFFSET}
            y={y - textHeight + 4 - TOOLTIP_Y_OFFSET - TOOLTIP_PADDING * 2}
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
            x={x + TOOLTIP_X_OFFSET + TOOLTIP_PADDING}
            y={y - TOOLTIP_Y_OFFSET - TOOLTIP_PADDING}
          > {value}
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
      )}
    </Animation>
  </Fragment>
))

GraphPoint.displayName = 'GraphPoint'
