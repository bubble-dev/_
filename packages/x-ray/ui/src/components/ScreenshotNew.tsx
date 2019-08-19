import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_NEW } from '../config'
import { Block } from './Block'
import { Border } from './Border'
import { Screenshot } from './Screenshot'

export type TScreenshotNew = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
}

export const ScreenshotNew = pureComponent(
  startWithType<TScreenshotNew>()
)(({ top, left, width, height, id, isDiscarded }) => (
  <Block top={top} left={left} width={width} height={height} opacity={isDiscarded ? 0.5 : 1}>
    <Screenshot
      id={id}
      type="new"
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
      color={COLOR_BORDER_NEW}
    />
  </Block>
))

ScreenshotNew.displayName = 'ScrenshotNew'
