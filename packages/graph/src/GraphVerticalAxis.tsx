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
  minValue: number,
}

const VERTICAL_TICK_STEP = 1
const TICK_SIZE = 10

export const GraphVerticalAxis = component(
  startWithType<TGraphTicks>(),
  mapWithPropsMemo(({ rect, maxValue, minValue }) => {
    const numTicks = (maxValue - minValue) * VERTICAL_TICK_STEP
    const verticalTickCoords = Array(numTicks + 1)
      .fill(null)
      .map((_, index) => rect.height - (index * rect.height / numTicks))

    const verticalTicks = verticalTickCoords.map((y) => ({
      x1: rect.x,
      x2: rect.x - TICK_SIZE,
      y1: y,
      y2: y,
    }))

    const axis = {
      x1: rect.x,
      x2: rect.x,
      y1: rect.y,
      y2: rect.height,
    }

    return {
      axis,
      verticalTicks,
    }
  }, ['rect', 'maxValue', 'minValue'])
)(({ axis, verticalTicks }) => (
  <Fragment>
    <line x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2} stroke="blue"/>
    {verticalTicks.map(({ x1, x2, y1, y2 }, index) =>
      <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="green"/>)}
  </Fragment>
))

GraphVerticalAxis.displayName = 'GraphVerticalAxis'
