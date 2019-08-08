import React from 'react'
import { component, startWithType } from 'refun'
import { TOmitKey } from 'tsfn'
import { TApiLoadScreenshotOpts } from '../api'
import { Screenshot } from './Screenshot'
import { Block } from './Block'
import { TRect } from './types'

export type TScreenshotDeleted = TOmitKey<TApiLoadScreenshotOpts, 'type'> & TRect

export const ScreenshotDeleted = component(
  startWithType<TScreenshotDeleted>()
)(({ top, left, file, props, width, height }) => (
  <Block top={top - height / 2} left={left - width / 2}>
    <Screenshot
      file={file}
      type="old"
      props={props}
      width={width}
      height={height}
    />
  </Block>
))
