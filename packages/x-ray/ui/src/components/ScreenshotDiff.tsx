import React, { Fragment } from 'react'
import { startWithType, pureComponent } from 'refun'
import { Block } from './Block'
import { TPosition } from './types'
import { Background } from './Background'
import { Border } from './Border'

export type TScreenshotDiff = TPosition & {
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number,
  oldAlpha: number,
  newAlpha: number,
}

export const ScreenshotDiff = pureComponent(
  startWithType<TScreenshotDiff>()
)(({ left, top, oldWidth, oldHeight, newWidth, newHeight, oldAlpha, newAlpha }) => (
  <Fragment>
    <Block
      top={top}
      left={left}
      width={oldWidth}
      height={oldHeight}
      opacity={oldAlpha}
    >
      <Background color={[255, 255, 255, 1]}/>
      <Border
        topWidth={2}
        leftWidth={2}
        rightWidth={2}
        bottomWidth={2}
        color={[255, 0, 0, 1]}
      />
    </Block>
    <Block
      top={top}
      left={left}
      width={newWidth}
      height={newHeight}
      opacity={newAlpha}
    >
      <Background color={[255, 255, 255, 1]}/>
      <Border
        topWidth={2}
        leftWidth={2}
        rightWidth={2}
        bottomWidth={2}
        color={[0, 0, 255, 1]}
      />
    </Block>
  </Fragment>
))
