import React, { Fragment } from 'react'
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
  hoveredGraph: string | null,
  scale: number,
  selectedGraph: string | null,
  width: number,
  onSelectGraph: (key: string | null) => void,
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
  }, ['width', 'height']),
  mapWithPropsMemo(({ graphs, selectedGraph, hoveredGraph }) => ({
    graphs: graphs.map((graph) => {
      return {
        ...graph,
        isActive: selectedGraph === graph.key || hoveredGraph === graph.key || (selectedGraph == null && hoveredGraph === null),
      }
    }),
  }), ['graphs', 'selectedGraph', 'hoveredGraph']),
  mapWithPropsMemo(({ graphs }) => {
    const newGraphs = graphs.slice(0)

    newGraphs.sort((a) => {
      if (a.isActive) {
        return 1
      }

      return -1
    })

    return {
      graphs: newGraphs,
    }
  }, ['graphs'])
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
    <rect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      fill="#1e2730"
      onClick={
        () => {
          onSelectGraph(null)
        }
      }
    />
    <Animation
      easing={easeInOutCubic}
      time={500}
      values={[scale]}
    >
      {([scale]) => (
        <Fragment>
          {graphs.map((graph) => (
            <Graph
              key={graph.key}
              color={graph.color}
              entries={graph.values}
              id={graph.key}
              isActive={graph.isActive}
              rect={rect}
              scale={scale}
              shouldShowDots={selectedGraph !== null && selectedGraph === graph.key}
              onHover={onHoverGraph}
              onSelect={onSelectGraph}
            />
          ))}

        </Fragment>
      )}
    </Animation>
  </svg>
))

GraphCanvas.displayName = 'GraphCanvas'
