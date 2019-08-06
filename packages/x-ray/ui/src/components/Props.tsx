import React from 'react'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { isUndefined } from 'tsfn'
import { mapStoreState } from '../store'
import { Block } from './Block'
import { TRect } from './types'

export type TProps = TRect

export const Props = component(
  startWithType<TProps>(),
  mapStoreState(({ selectedItem }) => ({
    selectedItem,
  }), ['selectedItem'])
)(({ top, left, width, height, selectedItem }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
  >
    <h2>props:</h2>
    {!isUndefined(selectedItem) && (
      <pre>
        {
          JSON.stringify(
            JSON.parse(selectedItem.props),
            null,
            2
          )
        }
      </pre>
    )}
  </Block>
))
