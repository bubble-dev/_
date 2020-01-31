import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'

export type TGraphTicks = {
  rect: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  maxValue: number,
}

const VERTICAL_TICK_STEP_SIZE = 40
const TICK_SIZE = 10
const TEXT_OFFSET_X = 12
const TEXT_OFFSET_Y = 5
// TODO move to file

export const GraphVerticalAxis = component(
  startWithType<TGraphTicks>(),
  mapWithPropsMemo(({ rect, maxValue }) => {
    const maxTicksCount = Math.floor(rect.height / VERTICAL_TICK_STEP_SIZE)
    const valueStep = maxValue / maxTicksCount - maxValue / maxTicksCount * 10 % 5 / 10
    const scale = maxValue / rect.height
    const pxStep = valueStep / scale
    const ticks = Array(maxTicksCount + 1)
      .fill(null)
      .map((_, index) => {
        const y = rect.height + rect.y - (index * pxStep)
        const value = (index * valueStep)

        return {
          x1: rect.x,
          x2: rect.x - TICK_SIZE,
          y1: y,
          y2: y,
          value,
        }
      })

    const axis = {
      x1: rect.x,
      x2: rect.x,
      y1: rect.y,
      y2: rect.height + rect.y,
    }

    return {
      axis,
      ticks,
    }
  }, ['rect', 'maxValue'])
)(({ axis, ticks }) => (
  <Fragment>
    <line
      x1={axis.x1}
      y1={axis.y1}
      x2={axis.x2}
      y2={axis.y2}
      stroke="blue"
    />
    {ticks.map(({ x1, x2, y1, y2, value }, index) => (
      (
        <Fragment key={`${x1}${index}`}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="green"
          />
          <text
            x={x1 - TEXT_OFFSET_X}
            y={y1 + TEXT_OFFSET_Y}
            textAnchor="end"
          > {value}
          </text>
        </Fragment>
      )
    ))}
  </Fragment>
))

GraphVerticalAxis.displayName = 'GraphVerticalAxis'
