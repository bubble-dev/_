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
const TICK_SHIFT = 5
const OFFSET = 0.3

export const GraphHorizontalAxis = component(
  startWithType<TGraphTicks>(),
  mapWithPropsMemo(({ rect, entries }) => {
    const ticks = entries.map((_, index) => {
      const step = rect.width / entries.length
      const x = index * step + rect.x
      const offset = rect.width / entries.length * OFFSET

      return {
        x1: x + offset,
        x2: x + TICK_SHIFT + offset,
        y1: rect.height + rect.y,
        y2: rect.height + rect.y + TICK_SIZE,
      }
    })

    const axis = {
      x1: rect.x,
      x2: rect.x + rect.width,
      y1: rect.height + rect.y,
      y2: rect.height + rect.y,
    }

    return {
      axis,
      ticks,
    }
  }, ['rect', 'entries'])
)(({ axis, ticks }) => (
  <Fragment>
    <line
      x1={axis.x1}
      y1={axis.y1}
      x2={axis.x2}
      y2={axis.y2}
      stroke="blue"
    />
    {ticks.map(({ x1, x2, y1, y2 }, index) => (
      <line
        key={`${x1}${index}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="green"
      />
    ))}
  </Fragment>
))

GraphHorizontalAxis.displayName = 'GraphHorizontalAxis'
