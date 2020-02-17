import React, { Fragment, Ref } from 'react'
import { component, startWithType, mapHovered, TMapHovered } from 'refun'
import { TColor } from '@sandbox/ui/src/colors'
import { colorToString } from 'colorido'
import { CONTROLS_HEIGHT } from './constants'

export type TGraphControls = {
  graphControls: {
    key: string,
    colors: TColor[],
  }[],
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
        overflow: 'scroll',
        position: 'absolute',
        width,
      }}
    >
      {graphControls.map(({ key: name, colors }) => (
        <button
          style={{
            background: 'white',
            border: 'none',
            borderWidth: 8,
            borderStyle: 'solid',
            borderBottom: 0,
            borderRight: 0,
            borderLeft: 0,
            borderImageSource: `linear-gradient(45deg, ${colorToString(colors[0])}, ${colorToString(colors[1])})`,
            borderImageSlice: 1,
            borderRadius: '0 0 10px 10px',
            boxShadow: `0 0 ${selectedGraph === name ? 12 : 1}px ${colorToString(colors[0])}`,
            cursor: 'pointer',
            fontSize: 14,
            margin: 10,
            opacity: !selectedGraph || selectedGraph === name ? 1 : 0.5,
            padding: '10px 15px',
            position: 'relative',
            height: 50,
            flexShrink: 0,
          }}
          key={name}
          onClick={() => {
            onSelectGraph(name)
          }}
        >
          {name}
        </button>
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
        key={name}
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
