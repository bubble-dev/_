import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TCanvas } from './types'
import { Graph } from './Graph'
import { CANVAS_PADDING, PAGE_BACKGROUND, CONTROLS_HEIGHT } from './constants'

export const Canvas = component(
  startWithType<TCanvas>(),
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
    <input
      style={{
        position: 'absolute',
        width: 130,
        top: 100,
        left: rect.width + 50,
        transform: 'rotate(270deg)',
      }}
      type="range"
      min="10"
      max="100"
      value={scale}
      onChange={onSliderChange}
    />
    <svg
      width={width}
      height={height}
    >
      <rect
        x={0}
        y={rect.y}
        width="100%"
        height={rect.height}
        fill={PAGE_BACKGROUND}
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
  </div>
))

Canvas.displayName = 'Canvas'
