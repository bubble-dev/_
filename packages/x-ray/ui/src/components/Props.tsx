import React from 'react'
import { component, startWithType } from 'refun'
import { isUndefined } from 'tsfn'
import { TRect } from '../types'
import { mapStoreState } from '../store'
import { Block } from './Block'

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
          JSON.stringify(selectedItem, null, 2)
        }
      </pre>
    )}
  </Block>
))
