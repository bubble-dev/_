import React from 'react'
import { component, startWithType } from 'refun'
import { Block } from './Block'
import { TRect } from './types'

export type TProps = TRect

export const Props = component(
  startWithType<TProps>()
)(({ top, left, width, height }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
  >
    <h2>props:</h2>
  </Block>
))
