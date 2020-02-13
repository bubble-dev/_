import React from 'react'
import { component, startWithType, mapWithPropsMemo, mapState, mapHandlers, mapDebouncedHandlerTimeout, onMount } from 'refun'
import { Root } from '@primitives/root'
import { GraphCanvas } from './GraphCanvas'
import { TGraph } from './types'

export type TApp = {
  graphs: TGraph[],
}

export const App = component(
  startWithType<TApp>(),
  mapState('scale', 'setScale', () => 0, []),
  mapHandlers({
    onSliderChange: ({ setScale }) => (e) => {
      setScale(e.target.value)
    },
  }),
  onMount(({ setScale }) => {
    setTimeout(() => {
      setScale(50)
    }, 0)
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
    graphKeys: graphs.map((graph) => graph.key),
  }), ['graphs'])
)(({
  graphs,
  scale,
  graphKeys,
  selectedGraph,
  hoveredGraph,
  onSelectGraph,
  onHoverGraph,
  onSliderChange,
}) => (
  <Root>
    {({ width, height }) => (
      <div style={{ display: 'block', background: '#24303a' }}>
        <input
          style={{ position: 'absolute' }}
          type="range"
          min="0"
          max="100"
          value={scale}
          onChange={onSliderChange}
        />
        {/* // TODO controls view */}
        <div style={{ position: 'absolute', display: 'none' }}>
          {graphKeys.map((name: string) => (
            <button
              style={{
                fontSize: '14px',
                margin: '2px',
                border: `3px solid ${(selectedGraph === name || hoveredGraph === name) ? 'red' : 'pink'}`,
              }}
              key={name}
              onClick={() => {
                onSelectGraph(name)
              }}
            >
              {name}
            </button>
          ))}
          <br/>
          <br/>
          <button
            style={{ fontSize: '14px', position: 'absolute', right: 0 }}
            key={name}
            onClick={() => {
              onSelectGraph(null)
            }}
          >
            Show All
          </button>
        </div>
        <GraphCanvas
          graphs={graphs}
          height={height}
          scale={scale}
          selectedGraph={selectedGraph}
          hoveredGraph={hoveredGraph}
          width={width}
          onSelectGraph={onSelectGraph}
          onHoverGraph={onHoverGraph}
        />
      </div>
    )}
  </Root>
))

App.displayName = 'App'
