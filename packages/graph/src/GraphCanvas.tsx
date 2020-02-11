import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { TEntry, TGraph } from './types'
import { Graph } from './Graph'
import { CANVAS_PADDING } from './constants'

export type TGraphCanvas = {
  // activeGraph: {
  //   color: string,
  //   name: string,
  //   values: TEntry[],
  // },
  graphs: TGraph[],
  height: number,
  width: number,
  selectedGraph: string | null,
  onSelectGraph: (key: string) => void,
  onHoverGraph: (key: string | null) => void,
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
  // activeGraph,
  axisX,
  axisY,
  graphs,
  height,
  rect,
  width,
  selectedGraph,
  onSelectGraph,
  onHoverGraph,
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
    {graphs.map((graph) => (
      <Graph
        color={graph.color}
        entries={graph.values}
        height={height}
        id={graph.key}
        shouldShowTicks={selectedGraph !== null && selectedGraph === graph.key}
        isSelected={selectedGraph === graph.key || selectedGraph === null}
        key={graph.key}
        rect={rect}
        width={width}
        onSelect={onSelectGraph}
        onHover={onHoverGraph}
      />
    ))}
  </svg>
))

GraphCanvas.displayName = 'GraphCanvas'
