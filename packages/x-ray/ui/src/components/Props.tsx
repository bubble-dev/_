import React from 'react'
import { component, startWithType } from 'refun'
import { isUndefined } from 'tsfn'
import { TItem, TRect } from '../types'
import { Block } from './Block'

export type TProps = TRect & {
  item: TItem,
}

export const Props = component(
  startWithType<TProps>()
)(({ top, left, width, height, item }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
  >
    <h2>props:</h2>
    {!isUndefined(item) && (
      <pre>
        {
          JSON.stringify(item, null, 2)
        }
      </pre>
    )}
  </Block>
))
