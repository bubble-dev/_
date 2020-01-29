import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry } from './types'

export type TGraphTicks = {
  rect: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  entries: TEntry[],
}

const TICK_SIZE = 10

export const GraphHorizontalAxis = component(
  startWithType<TGraphTicks>(),
  mapWithPropsMemo(({ rect, entries }) => {
    const ticks = entries.map((_, index) => {
      const widthStep = (rect.width) / (entries.length - 1)
      const x = index * widthStep + rect.x

      return {
        x1: x,
        x2: x + 5,
        y1: rect.height,
        y2: rect.height + TICK_SIZE,
      }
    })

    const axis = {
      x1: rect.x,
      x2: rect.x + rect.width,
      y1: rect.height,
      y2: rect.height,
    }

    return {
      axis,
      ticks,
    }
  }, ['rect', 'entries'])
)(({ axis, ticks }) => (
  <Fragment>
    <line x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2} stroke="blue"/>
    {ticks.map(({ x1, x2, y1, y2 }, index) =>
      <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="green"/>)}
  </Fragment>
))

GraphHorizontalAxis.displayName = 'GraphHorizontalAxis'
