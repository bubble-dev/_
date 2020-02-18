import React from 'react'
import { component, startWithType, mapWithPropsMemo, mapState, mapHandlers, mapDebouncedHandlerTimeout, onMount, mapRefLayout } from 'refun'
import { Root } from '@primitives/root'
import { GraphCanvas } from './GraphCanvas'
import { GraphControls } from './GraphControls'
import { TGraph } from './types'
import { PAGE_BACKGROUND, CONTROLS_HEIGHT } from './constants'

export type TApp = {
  graphs: TGraph[],
}

export const App = component(
  startWithType<TApp>(),
  mapState('scale', 'setScale', () => 1, []),
  mapHandlers({
    onSliderChange: ({ setScale }) => (e) => {
      setScale(e.target.value)
    },
  }),
  onMount(({ setScale }) => {
    setTimeout(() => {
      setScale(50)
    }, 200)
  }),
  mapState('selectedGraph', 'setSelectedGraph', () => null, []),
  mapState('hoveredGraph', 'setHoveredGraph', () => null, []),
  mapHandlers(({
    onSelectGraph: ({ selectedGraph, setSelectedGraph, setHoveredGraph }) => (name) => {
      if (selectedGraph !== name) {
        setSelectedGraph(name)
        setHoveredGraph(name)
      }
    },
    onHoverGraph: ({ selectedGraph, setHoveredGraph }) => (id) => {
      if (selectedGraph === null) {
        setHoveredGraph(id)
      }
    },
  })),
  mapDebouncedHandlerTimeout('onHoverGraph', 100),
  mapWithPropsMemo(({ graphs }) => ({
    graphControls: graphs.map((graph) => {
      const lastValue = graph.values[graph.values.length - 1].value
      const preLastValue = graph.values[graph.values.length - 2].value
      const lastDifference = Math.round((lastValue - preLastValue) / preLastValue * 100.0)

      return {
        colors: graph.colors,
        key: graph.key,
        lastDifference,
        name: graph.key.replace(/[A-Z]/g, ' $&'),
      }
    }),
  }), ['graphs'])
)(({
  graphs,
  graphControls,
  scale,
  selectedGraph,
  hoveredGraph,
  onSelectGraph,
  onHoverGraph,
  onSliderChange,
}) => (
  <Root>
    {({ width, height }) => (
      <div style={{ background: PAGE_BACKGROUND, width, height, position: 'absolute' }}>
        <GraphControls
          graphControls={graphControls}
          selectedGraph={selectedGraph}
          onSelectGraph={onSelectGraph}
        />
        <GraphCanvas
          graphs={graphs}
          height={height - CONTROLS_HEIGHT}
          scale={scale}
          selectedGraph={selectedGraph}
          hoveredGraph={hoveredGraph}
          width={width}
          onHoverGraph={onHoverGraph}
          onSelectGraph={onSelectGraph}
          onSliderChange={onSliderChange}
        />
      </div>
    )}
  </Root>
))

App.displayName = 'App'
