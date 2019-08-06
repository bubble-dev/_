import React from 'react'
import { component, startWithType, mapState } from 'refun'
import { TOmitKey } from 'tsfn'
import { TApiLoadScreenshotOpts } from '../api'
import { Screenshot } from './Screenshot'
import { Block } from './Block'
import { TPosition } from './types'

export type TScreenshotNew = TOmitKey<TApiLoadScreenshotOpts, 'type'> & TPosition

export const ScreenshotNew = component(
  startWithType<TScreenshotNew>(),
  mapState('size', 'onSizeChange', () => ({ width: 0, height: 0 }), [])
)(({ top, left, file, props, size, onSizeChange }) => (
  <Block top={top - size.height / 2} left={left - size.width / 2}>
    <Screenshot
      file={file}
      type="new"
      props={props}
      width={size.width}
      height={size.height}
      onLoad={onSizeChange}
    />
  </Block>
))
