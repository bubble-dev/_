import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
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
  scale: number,
  selectedGraph: string | null,
  width: number,
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

    return {
      rect,
    }
  }, ['width', 'height'])
)(({
  graphs,
  height,
  rect,
  scale,
  width,
  selectedGraph,
  onSelectGraph,
  onHoverGraph,
}) => (
  <svg width={width} height={height}>
    <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill="#1e2730"/>
    {graphs.map((graph) => (
      <Animation
        key={graph.key}
        easing={easeInOutCubic}
        time={500}
        values={[scale]}
      >
        {([scale]) => (
          <Graph
            color={graph.color}
            entries={graph.values}
            id={graph.key}
            isSelected={selectedGraph === graph.key || selectedGraph === null}
            rect={rect}
            scale={scale}
            shouldShowDots={selectedGraph !== null && selectedGraph === graph.key}
            onHover={onHoverGraph}
            onSelect={onSelectGraph}
          />
        )}
      </Animation>
    ))}
  </svg>
))

GraphCanvas.displayName = 'GraphCanvas'
