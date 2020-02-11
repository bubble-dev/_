import React from 'react'
import { component, startWithType, mapWithPropsMemo, mapState, mapHandlers } from 'refun'
import { Root } from '@primitives/root'
import { GraphCanvas } from './GraphCanvas'
import { TGraph } from './types'

export type TApp = {
  graphs: TGraph[],
}

export const App = component(
  startWithType<TApp>(),
  mapState('selectedGraph', 'setSelectedGraph', () => null, []),
  mapState('hoveredGraph', 'setHoveredGraph', () => null, []),

  mapHandlers(({
    onSelectGraph: ({ selectedGraph, setSelectedGraph }) => (name) => {
      if (selectedGraph !== name) {
        setSelectedGraph(name)
      }
    },
    onHoverGraph: ({ selectedGraph, setHoveredGraph }) => (id) => {
      console.log('TCL', id, selectedGraph)
      if (selectedGraph !== id || (selectedGraph === null && id === null)) {
        setHoveredGraph(id)
      }
    },
  })),
  mapWithPropsMemo(({ graphs }) => ({
    graphKeys: graphs.map((graph) => graph.key),
  }), ['graphs'])
)(({
  graphs,
  graphKeys,
  selectedGraph,
  hoveredGraph,
  onSelectGraph,
  onHoverGraph,
}) => (
  <Root>
    {({ width, height }) => (
      <div style={{ display: 'block' }}>
        <div style={{ position: 'absolute' }}>
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
            style={{ fontSize: '14px' }}
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
          width={width}
          selectedGraph={selectedGraph || hoveredGraph}
          onSelectGraph={onSelectGraph}
          onHoverGraph={onHoverGraph}
        />
      </div>
    )}
  </Root>
))

App.displayName = 'App'
