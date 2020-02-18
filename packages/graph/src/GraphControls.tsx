import React, { Fragment } from 'react'
import { component, startWithType } from 'refun'
import { Button } from './Button'
import { CONTROLS_HEIGHT } from './constants'
import { TGraphControl } from './types'

export type TGraphControls = {
  graphControls: TGraphControl[],
  width: number,
  selectedGraph: string | null,
  onSelectGraph: (key: string | null) => void,
}

export const GraphControls = component(
  startWithType<TGraphControls>()
)(({
  graphControls,
  selectedGraph,
  width,
  onSelectGraph,
}) => (
  <Fragment>
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: CONTROLS_HEIGHT,
        justifyContent: 'space-between',
        marginLeft: 8,
        marginRight: 10,
        overflow: 'scroll',
        position: 'absolute',
        width: width - 20,
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
      <button
        style={{
          background: 'white',
          border: 'none',
          borderRadius: 0,
          cursor: 'pointer',
          fontSize: 14,
          margin: 10,
          opacity: selectedGraph ? 1 : 0.5,
          padding: '10px 15px',
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
  </Fragment>
))

GraphControls.displayName = 'GraphControls'
