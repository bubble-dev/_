import React, { Fragment } from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TPosition } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, COLOR_BORDER_NEW, DISCARD_ALPHA } from '../config'
import { Block } from './Block'
import { Border } from './Border'
import { Screenshot } from './Screenshot'

export type TScreenshotDiff = TPosition & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number,
  oldAlpha: number,
  newAlpha: number,
  isDiscarded: boolean,
}

export const ScreenshotDiff = pureComponent(
  startWithType<TScreenshotDiff>()
)(({
  left,
  top,
  oldWidth,
  oldHeight,
  newWidth,
  newHeight,
  oldAlpha,
  newAlpha,
  id,
  isDiscarded,
}) => (
  <Fragment>
    <Block
      top={top}
      left={left}
      width={oldWidth}
      height={oldHeight}
      opacity={Math.min(oldAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
    >
      <Screenshot
        id={id}
        type="old"
        width={oldWidth}
        height={oldHeight}
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
    <Block
      top={top}
      left={left}
      width={newWidth}
      height={newHeight}
      opacity={Math.min(newAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
    >
      <Screenshot
        id={id}
        type="new"
        width={newWidth}
        height={newHeight}
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
  </Fragment>
))

ScreenshotDiff.displayName = 'ScreenshotDiff'
