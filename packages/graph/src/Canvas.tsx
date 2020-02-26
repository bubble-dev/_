import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TCanvas } from './types'
import { Graph } from './Graph'
import { CANVAS_PADDING, PAGE_BACKGROUND, CONTROLS_HEIGHT_TOP, GRAPH_OFFSET } from './constants'

export const Canvas = component(
  startWithType<TCanvas>(),
  mapWithPropsMemo(({ width, height }) => {
    const rect = {
      x: 0,
      y: 0,
      width,
      height,
    }

    return {
      rect,
    }
  }, []),
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
  monthsAgo,
  rect,
  scale,
  width,
  selectedGraph,
  onHoverGraph,
  onSelectGraph,
  onSliderChange,
}) => (
  <Fragment>
    <svg
      style={{ position: 'absolute', left: CANVAS_PADDING, top: CONTROLS_HEIGHT_TOP }}
      width={width - CANVAS_PADDING * 2}
      height={height}
    >
      <rect
        x={0}
        y={rect.y}
        width="100%"
        height={rect.height}
        fill={'black'}
        onClick={
        () => {
          onSelectGraph(null)
        }
      }
      />
      <Animation
        easing={easeInOutCubic}
        time={200}
        values={[scale]}
      >
        {([scale]) => (
          <Fragment>
            {graphs.map((graph) => (
              <Graph
                colors={graph.colors}
                entries={graph.values}
                id={graph.key}
                isActive={graph.isActive}
                key={`${graph.key}-${monthsAgo}`}
                monthsAgo={monthsAgo}
                width={}
                height={}
                scale={scale}
                shouldShowDots={selectedGraph === graph.key}
                onHover={onHoverGraph}
                onSelect={onSelectGraph}
              />
            ))}
          </Fragment>
        )}
      </Animation>
    </svg>
    <input
      style={{
        position: 'absolute',
        width: 130,
        top: CONTROLS_HEIGHT_TOP + 100,
        left: rect.width + 50,
        transform: 'rotate(270deg)',
      }}
      type="range"
      min="10"
      max="100"
      value={scale}
      onChange={onSliderChange}
    />
  </Fragment>
))

Canvas.displayName = 'Canvas'
