import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TRect } from './types'
import {
  TEXT_OFFSET_X,
  TEXT_OFFSET_Y,
  TICK_SIZE,
  VERTICAL_TICK_STEP_SIZE,
} from './constants'

export type TGraphTicks = {
  rect: TRect,
  maxValue: number,
}

const round = (value: number): number => {
  let mult = 0.0001

  while (Math.floor(value * mult / 25) === 0) {
    mult = mult * 10
  }

  const v1 = value * mult
  const mod = v1 % 25

  return (v1 - mod) / mult
}

const printValue = (value: number): string => {
  if (value > 1000) {
    return `${value / 1000}k`
  }

  return value.toString()
}

export const GraphVerticalAxis = component(
  startWithType<TGraphTicks>(),
  mapWithPropsMemo(({ rect, maxValue }) => {
    const maxTicksCount = Math.floor(rect.height / VERTICAL_TICK_STEP_SIZE)
    const valueStep = round(maxValue / maxTicksCount)
    const scale = maxValue / rect.height
    const pxStep = valueStep / scale
    const tickCount = Math.floor(maxValue / valueStep)
    const ticks = Array(tickCount + 1)
      .fill(null)
      .map((_, index) => {
        const y = rect.height + rect.y - (index * pxStep)
        const value = printValue(index * valueStep)

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
