import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TColor, colorToString } from 'colorido'
import { TEntry, TRect } from './types'
import { OFFSET } from './constants'
import { GraphPoint } from './GraphPoint'

export type TGraphPath = {
  color: TColor,
  entries: TEntry[],
  shouldShowTicks: boolean,
  maxValue: number,
  id: string,
  rect: TRect,
  isSelected: boolean,
  onSelect: (key: string) => void,
  onHover: (key: string | null) => void,
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
)(({
  color,
  points,
  pointsString,
  rect,
  isSelected,
  id,
  shouldShowTicks,
  onSelect,
  onHover,
}) => {
  return (
    <Fragment>
      <Animation
        easing={easeInOutCubic}
        time={200}
        values={[isSelected ? 1 : 0.1]}
      >
        {([opacity]) => (
          <path
            opacity={opacity}
            d={`M ${pointsString}`}
            stroke={colorToString(color)}
            fill="none"
            strokeWidth={4}
            onClick={() => {
              onSelect(id)
            }}
            onPointerEnter={() => {
              onHover(id)
            }}
            onPointerLeave={() => {
              onHover(null)
            }}
          />
        )}
      </Animation>
      {shouldShowTicks && points.map((point) => (
        <GraphPoint
          key={`${point.x}-line`}
          x={point.x}
          y={point.y}
          value={Math.round(point.value * 1000) / 1000}
          rect={rect}
        />
      ))}
    </Fragment>
  )
})

GraphPath.displayName = 'GraphPath'
