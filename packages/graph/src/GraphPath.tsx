import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo, TMapHovered, mapHovered } from 'refun'
import { TEntry, TRect } from './types'
import { OFFSET } from './constants'
import { GraphPoint } from './GraphPoint'

export type TGraphPath = {
  color: string,
  entries: TEntry[],
  // hoverColor: string | null,
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
  // hoverColor,
  // index,
  // isSelectedGraph,
  // onHoverGraph,
  // onClickGraph,
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
      <path
        opacity={isSelected ? 1 : 0.3}
        d={`M ${pointsString}`}
        stroke={color}
        fill="none"
        strokeWidth="3"
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
      {shouldShowTicks && points.map((point) => (
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
