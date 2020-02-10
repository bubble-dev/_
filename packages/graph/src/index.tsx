import React from 'react'
import { component, startWithType, mapWithPropsMemo, mapState, mapHandlers } from 'refun'
import { Root } from '@primitives/root'
import { GraphCanvas } from './GraphCanvas'

export type TApp = {
  // graphs: TGraphs{},
}

const NOOP = () => null

export const App = component(
  startWithType<TApp>(),
  //TOD renamerename to Graph
  mapState('activeGraphButton', 'setActiveGraphButton', () => '', []),
  mapState('isHoverBlocked', 'setBlockHover', () => false, []),
  mapState('activePath', 'setActivePath', () => null, []),
  mapHandlers(({
    onActivePath: ({ setActivePath, setActiveGraphButton }) => (name) => {
      setActiveGraphButton(name)
      setActivePath(name)
    },
    onActiveGraphButton: ({ setActiveGraphButton, setActivePath, setBlockHover }) => (name) => {
      if (name) {
        setActiveGraphButton(name)
        setActivePath(name)
        setBlockHover(true)
      } else {
        setActiveGraphButton(name)
        setActivePath(name)
        setBlockHover(false)
      }
    },
  })),
  mapWithPropsMemo(({ activePath, graphs: tempGraphs }) => {
    const valuesKeys = Object.keys(tempGraphs)
    const activeGraph = activePath ? {
      ...tempGraphs[activePath],
      name: activePath,
    } : null
    const graphs = valuesKeys.map((graph) => {
      return {
        ...tempGraphs[graph],
        name: graph,
      }
    })

    return {
      activeGraph,
      buttons: valuesKeys,
      graphs,
    }
  }, ['activePath', 'graphs'])
)(({
  activeGraph,
  buttons,
  graphs,
  onActivePath,
  setActiveButton,
  setActivePath,
  setTab,
  onActiveGraphButton,
  isHoverBlocked,
  activeGraphButton,
}) => (
  <Root>
    {({ width, height }) => (
      <div style={{ display: 'block' }}>
        <div style={{ position: 'absolute' }}>
          {buttons.map((name: string) => (
            <button
              style={{
                fontSize: '14px',
                margin: '2px',
                border: `3px solid ${activeGraphButton === name ? 'red' : 'pink'}`,
              }}
              key={name}
              onClick={() => {
                onActiveGraphButton(name)
              }}
              // onMouseOver={() => {
              //   onActiveGraphButton(name)
              // }}
              // onMouseOut={() => {
              //   onActiveGraphButton()
              // }}
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
              onActiveGraphButton()
            }}
          >
            Show All
          </button>
        </div>
        <GraphCanvas
          activeGraph={activeGraph}
          graphs={graphs}
          height={height}
          onActivePath={isHoverBlocked ? NOOP : onActivePath}
          width={width}
        />
      </div>
    )}
  </Root>
))

App.displayName = 'App'
