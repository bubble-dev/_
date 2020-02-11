import React, { Fragment, RefObject } from 'react'
import { component, startWithType, mapWithPropsMemo, onMount, mapState, mapRefLayout, mapSafeRequestAnimationFrame, mapRef } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TEntry, TRect } from './types'
import { OFFSET } from './constants'
import { GraphPoint } from './GraphPoint'

export type TGraphPath = {
  color: string,
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
  mapRefLayout('pathRef', (ref) => {
    console.log('TCL: ref', ref)
    if (ref !== null) {
      return { pathLength: ref.getTotalLength() }
    }

    return { pathLength: 0 }
  }, []),
  mapState('pathOffset', 'setPathOffset', () => 100, []),
  onMount(({ setPathOffset }) => {
    setTimeout(() => {
      setPathOffset(0)
    }, 5000)
  }),
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
  pathRef,
  color,
  points,
  pointsString,
  rect,
  isSelected,
  id,
  shouldShowTicks,
  onSelect,
  onHover,
  pathLength,
  pathOffset,
}) => {
  console.log('render', pathOffset, pathLength)

  return (
    <Fragment>
      <Animation
        shouldNotAnimate={pathLength === null}
        easing={easeInOutCubic}
        time={1000}
        values={[
          isSelected ? 1 : 0.1,
          pathOffset,
        ]}
      >
        {([opacity, pathOffset]) => (
          <path
            ref={pathRef}
            opacity={opacity}
            d={`M ${pointsString}`}
            stroke={`rgba(${color.join(',')})`}
            fill="none"
            strokeWidth={4}
            strokeDasharray={pathLength}
            strokeDashoffset={`${pathOffset}%`}
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
