import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TRect } from '../types'
import { Block } from './Block'
import { Background } from './Background'
import { Border } from './Border'

export type TScreenshotDeleted = TRect

export const ScreenshotDeleted = pureComponent(
  startWithType<TScreenshotDeleted>()
)(({ top, left, width, height }) => (
  <Block top={top} left={left} width={width} height={height}>
    <Background color={[255, 255, 255, 1]}/>
    <Border
      topWidth={2}
      leftWidth={2}
      rightWidth={2}
      bottomWidth={2}
      color={[127, 0, 0, 1]}
    />
  </Block>
))
