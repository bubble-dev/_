import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry } from './types'
import { GraphPoint } from './GraphPoint'

export type TGraphPath = {
  rect: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  entries: TEntry[],
  maxValue: number,
}

const OFFSET = 0.3

export const GraphPath = component(
  startWithType<TGraphPath>(),
  mapWithPropsMemo(({ entries, rect, maxValue }) => {
    const points = entries.map(({ value }, index) => {
      return {
        x: rect.x + (rect.width / entries.length) * index + (rect.width / entries.length * OFFSET),
        y: (1 - (value * 100) / maxValue / 100) * rect.height + rect.y,
        value,
      }
    })

    return {
      points,
      pointsString: points.map(({ x, y }) => `${x}, ${y}`).join(' '),
    }
  }, ['entries', 'rect', 'maxValue'])
)(({ pointsString, points, rect }) => {
  return (
    <Fragment>
      <path
        d={`M ${pointsString}`}
        stroke="red"
        fill="none"
        strokeWidth="3"
      />
      {points.map((point) => (
        <GraphPoint
          key={`${point.x}-line`}
          x={point.x}
          y={point.y}
          value={point.value}
          rect={rect}
        />
      ))}
    </Fragment>
  )
})

GraphPath.displayName = 'GraphPath'
