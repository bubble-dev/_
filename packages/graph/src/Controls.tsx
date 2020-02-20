import React from 'react'
import { component, startWithType } from 'refun'
import { Button } from './Button'
import { CONTROLS_HEIGHT } from './constants'
import { TControls } from './types'

export const Controls = component(
  startWithType<TControls>()
)(({
  graphControls,
  selectedGraph,
  onSelectGraph,
}) => (
  <div style={{
    display: 'flex',
    height: CONTROLS_HEIGHT,
  }}
  >
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        overflow: 'scroll',
      }}
    >
      {graphControls.map(({ key, name, colors, lastDifference }) => (
        <Button
          colors={colors}
          idKey={key}
          key={key}
          lastDifference={lastDifference}
          name={name}
          selectedGraph={selectedGraph}
          onSelectGraph={onSelectGraph}
        />
      ))}
    </div>
    <button
      style={{
        background: 'white',
        border: 'none',
        borderRadius: 0,
        cursor: 'pointer',
        fontSize: 14,
        marginLeft: 20,
        marginRight: 20,
        height: 30,
        alignSelf: 'center',
        opacity: selectedGraph ? 1 : 0.5,
        position: 'relative',
        flexShrink: 0,
      }}
      onClick={() => {
        onSelectGraph(null)
      }}
    >
      Show all
    </button>
  </div>
))

Controls.displayName = 'Controls'
