import React from 'react'
import { component, startWithType, mapState, mapHandlers } from 'refun'
import { Button } from '@primitives/button'
import { TOmitKey } from 'tsfn'
import { TApiLoadScreenshotOpts } from '../api'
import { Screenshot } from './Screenshot'
import { Block } from './Block'
import { TPosition } from './types'

export type TScreenshotDiff = TOmitKey<TApiLoadScreenshotOpts, 'type'> & TPosition & {
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number,
}

export const ScreenshotDiff = component(
  startWithType<TScreenshotDiff>(),
  mapState('state', 'setState', () => false, []),
  mapHandlers({
    onClick: ({ state, setState }) => () => setState(!state),
  })
)(({ top, left, file, props, state, oldWidth, oldHeight, newWidth, newHeight, onClick }) => (
  <Block top={top - oldHeight / 2} left={left - oldWidth / 2}>
    <Button onPress={onClick}>
      <Block opacity={state ? 0 : 1}>
        <Screenshot
          file={file}
          type="old"
          props={props}
          width={oldWidth}
          height={oldHeight}
        />
      </Block>
      <Block opacity={state ? 1 : 0}>
        <Screenshot
          file={file}
          type="new"
          props={props}
          width={newWidth}
          height={newHeight}
        />
      </Block>
    </Button>
  </Block>
))
