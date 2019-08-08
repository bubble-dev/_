import React from 'react'
import { component, startWithType } from 'refun'
import { TOmitKey } from 'tsfn'
import { TApiLoadScreenshotOpts } from '../api'
import { Screenshot } from './Screenshot'
import { Block } from './Block'
import { TRect } from './types'

export type TScreenshotNew = TOmitKey<TApiLoadScreenshotOpts, 'type'> & TRect

export const ScreenshotNew = component(
  startWithType<TScreenshotNew>()
)(({ top, left, file, props, width, height }) => (
  <Block top={top - height / 2} left={left - width / 2}>
    <Screenshot
      file={file}
      type="new"
      props={props}
      width={width}
      height={height}
    />
  </Block>
))
