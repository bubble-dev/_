import React, { Fragment, ChangeEvent } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TGraph } from './types'
import { Graph } from './Graph'
import { CANVAS_PADDING, GRAPH_BACKGROUND, CONTROLS_HEIGHT } from './constants'

export type TGraphCanvas = {
  graphs: TGraph[],
  height: number,
  hoveredGraph: string | null,
  scale: number,
  selectedGraph: string | null,
  width: number,
  onHoverGraph: (key: string | null) => void,
  onSelectGraph: (key: string | null) => void,
  onSliderChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export const GraphCanvas = component(
  startWithType<TGraphCanvas>(),
  mapWithPropsMemo(({ width, height }) => {
    const rect = {
      x: CANVAS_PADDING,
      y: 0,
      width: width - CANVAS_PADDING * 2,
      height: height - CANVAS_PADDING,
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
  onHoverGraph,
  onSelectGraph,
  onSliderChange,
}) => (
  <div style={{ position: 'absolute', height, top: CONTROLS_HEIGHT }}>
    <svg
      width={width}
      height={height}
    >
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={GRAPH_BACKGROUND}
        onClick={
        () => {
          onSelectGraph(null)
        }
      }
      />
      <Animation
        easing={easeInOutCubic}
        time={350}
        values={[scale]}
      >
        {([scale]) => (
          <Fragment>
            {graphs.map((graph) => (
              <Graph
                key={graph.key}
                colors={graph.colors}
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
    <div style={{
      position: 'absolute',
      height: 15,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
    }}
    >
      <input
        style={{
          width: 130,
        }}
        type="range"
        min="10"
        max="100"
        value={scale}
        onChange={onSliderChange}
      />
    </div>
  </div>
))

GraphCanvas.displayName = 'GraphCanvas'
