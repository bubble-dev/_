import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry, TRect } from './types'
import { OFFSET } from './constants'
import { GraphPoint } from './GraphPoint'

export type TGraphPath = {
  rect: TRect,
  entries: TEntry[],
  maxValue: number,
}

export const GraphPath = component(
  startWithType<TGraphPath>(),
  mapWithPropsMemo(({ entries, rect, maxValue }) => {
    const step = rect.width / entries.length
    const points = entries.map(({ value }, index) => {
      return {
        x: rect.x + step * index + (step * OFFSET),
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
