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

export const GraphPath = component(
  startWithType<TGraphPath>(),
  mapWithPropsMemo(({ entries, maxValue, rect }) => {
    const points = entries.map(({ value }, index) => {
      return {
        x: rect.x + (rect.width / (entries.length - 1)) * index,
        y: (1 - (value * 100) / maxValue / 100) * rect.height,
        value,
      }
    })

    return {
      points,
      pointsString: points.map(({ x, y }) => `${x}, ${y}`).join(' '),
    }
  }, ['entries', 'maxValue', 'rect'])
)(({ pointsString, points }) => {
  return (
    <Fragment>
      <path d={`M ${pointsString}`} stroke="red" fill="none" strokeWidth="3"/>
      {points.map((point, index) => (
        <Fragment key={index + 1}>
          <line key={`${point.x}-line`} x1={point.x} y1={0} x2={point.x} y2={380} stroke="green"/>
          <GraphPoint
            key={`${point.x}-circle`}
            x={point.x}
            y={point.y}
            value={point.value}
          />
        </Fragment>
      ))}
    </Fragment>
  )
})

GraphPath.displayName = 'GraphPath'
