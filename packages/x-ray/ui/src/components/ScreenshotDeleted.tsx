import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED } from '../config'
import { Block } from './Block'
import { Border } from './Border'
import { Screenshot } from './Screenshot'

export type TScreenshotDeleted = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
}

export const ScreenshotDeleted = pureComponent(
  startWithType<TScreenshotDeleted>()
)(({ top, left, width, height, id, isDiscarded }) => (
  <Block top={top} left={left} width={width} height={height} opacity={isDiscarded ? 0.5 : 1}>
    <Screenshot
      id={id}
      type="old"
      width={width}
      height={height}
    />
    <Border
      topWidth={2}
      leftWidth={2}
      rightWidth={2}
      bottomWidth={2}
      overflowTop={2}
      overflowLeft={2}
      overflowRight={2}
      overflowBottom={2}
      color={COLOR_BORDER_DELETED}
    />
  </Block>
))

ScreenshotDeleted.displayName = 'ScreenshotDeleted'
