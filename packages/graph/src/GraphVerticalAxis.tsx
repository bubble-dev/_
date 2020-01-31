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
const TEXT_OFFSET_X = 20
const TEXT_OFFSET_Y = 2
// TODO move to file

export const GraphVerticalAxis = component(
  startWithType<TGraphTicks>(),
  mapWithPropsMemo(({ rect, maxValue }) => {
    const maxTicksCount = Math.floor(rect.height / VERTICAL_TICK_STEP_SIZE)
    const ticks = Array(maxTicksCount + 1)
      .fill(null)
      .map((_, index) => {
        const y = rect.height + rect.y - (index * rect.height / maxTicksCount)
        const value = (maxValue * index / maxTicksCount).toFixed(1)

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
)(({ axis, ticks, rect }) => (
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
            x2={x2 + rect.width}
            y2={y2}
            // TODO ad doption
            // x2={x2}
            // y2={y2}
            stroke="green"
          />
          <text
            x={x1 - TEXT_OFFSET_X}
            y={y1 + TEXT_OFFSET_Y}
          > {value}
          </text>
        </Fragment>
      )
    ))}
  </Fragment>
))

GraphVerticalAxis.displayName = 'GraphVerticalAxis'
