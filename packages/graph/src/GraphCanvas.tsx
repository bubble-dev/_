import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry } from './types'
import { GraphApp as Graph } from './GraphApp'
import { CANVAS_PADDING } from './constants'

export type TGraphCanvas = {
  activeGraph: {
    color: string,
    name: string,
    values: TEntry[],
  },
  graphs: TEntry[],
  height: number,
  width: number,
}

export const GraphCanvas = component(
  startWithType<TGraphCanvas>(),
  mapWithPropsMemo(({ width, height }) => {
    const rect = {
      x: CANVAS_PADDING,
      y: CANVAS_PADDING,
      width: width - CANVAS_PADDING * 2,
      height: height - CANVAS_PADDING * 2,
    }

    const axisX = {
      x1: rect.x,
      x2: rect.x + rect.width,
      y1: rect.height + rect.y,
      y2: rect.height + rect.y,
    }
    const axisY = {
      x1: rect.x,
      x2: rect.x,
      y1: rect.y,
      y2: rect.height + rect.y,
    }

    return {
      axisX,
      axisY,
      rect,
    }
  }, ['width', 'height'])
)(({
  activeGraph,
  axisX,
  axisY,
  graphs,
  height,
  onActivePath,
  rect,
  width,
}) => (
  <svg width={width} height={height} stroke="none">
    <line
      x1={axisX.x1}
      y1={axisX.y1}
      x2={axisX.x2}
      y2={axisX.y2}
      stroke="blue"
    />
    <line
      x1={axisY.x1}
      y1={axisY.y1}
      x2={axisY.x2}
      y2={axisY.y2}
      stroke="blue"
    />
    {activeGraph ? (
      <Graph
        isActiveGraph
        color={activeGraph.color ? activeGraph.color : 'red'}
        entries={activeGraph.values}
        height={height}
        index={activeGraph.name}
        onActivePath={onActivePath}
        rect={rect}
        showXY
        width={width}
      />
    ) : graphs.map((graph, index) => (
      <Graph
        index={graph.name}
        color={graph.color}
        entries={graph.values}
        height={height}
        key={index}
        onActivePath={onActivePath}
        rect={rect}
        width={width}
      />
    ))}
  </svg>
))

GraphCanvas.displayName = 'GraphCanvas'
