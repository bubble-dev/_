import React, { Fragment } from 'react'
import { component, startWithType, mapState, mapWithPropsMemo } from 'refun'
import { Root } from '@primitives/root'
import { AccessibilityInfo } from 'react-native'
import { TGraphs } from './types'
import { GraphApp } from './GraphApp'

export type TApp = {
  // graphs: TGraphs{},
}

export const App = component(
  startWithType<TApp>(),
  mapState('tabIndex', 'setTab', ({ graphs }) => Object.keys(graphs)[0], ['graphs']),
  mapWithPropsMemo(({ graphs, tabIndex }) => {
    return {
      buttons: Object.keys(graphs),
      graph: graphs[tabIndex],
    }
  }, ['graphs', 'tabIndex'])
)(({ setTab, graph, buttons }) => (
  <Root>
    {({ width, height }) => (
      <div style={{ display: 'block' }}>
        <div>
          {buttons.map((name) => (
            <button
              key={name}
              onClick={() => {
                setTab(name)
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div>
          <GraphApp
            entries={graph}
            height={500}
            width={700}

          />
        </div>
      </div>
    )}
  </Root>
  // <GraphApp
  //   entries={entries}
  //   height={340}
  //   width={640}
  // />
))

App.displayName = 'App'
