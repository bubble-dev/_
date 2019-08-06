import React from 'react'
import { component, startWithType, mapState, mapHandlers } from 'refun'
import { Button } from '@primitives/button'
import { TItem } from '../types'
import { Screenshot } from './Screenshot'
import { Block } from './Block'
import { TPosition } from './types'

export type TScreenshotDiff = TItem & TPosition

export const ScreenshotDiff = component(
  startWithType<TScreenshotDiff>(),
  mapState('state', 'setState', () => false, []),
  mapState('oldSize', 'onOldSizeChange', () => ({ width: 0, height: 0 }), []),
  mapState('newSize', 'onNewSizeChange', () => ({ width: 0, height: 0 }), []),
  mapHandlers({
    onClick: ({ state, setState }) => () => setState(!state),
  })
)(({ top, left, file, props, state, oldSize, newSize, onClick, onOldSizeChange, onNewSizeChange }) => (
  <Block top={top - oldSize.height / 2} left={left - oldSize.width / 2}>
    <Button onPress={onClick}>
      <Block opacity={state ? 0 : 1}>
        <Screenshot
          file={file}
          type="old"
          item={props}
          width={oldSize.width}
          height={oldSize.height}
          onLoad={onOldSizeChange}
        />
      </Block>
      <Block opacity={state ? 1 : 0}>
        <Screenshot
          file={file}
          type="new"
          item={props}
          width={newSize.width}
          height={newSize.height}
          onLoad={onNewSizeChange}
        />
      </Block>
    </Button>
  </Block>
))
