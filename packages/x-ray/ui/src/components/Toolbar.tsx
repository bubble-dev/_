import React from 'react'
import { component, startWithType, mapHandlers } from 'refun'
import { TOmitKey } from 'tsfn'
import { mapStoreDispatch } from '../store'
import { actionSave } from '../actions'
import { TItem } from '../types'
import { Block } from './Block'
import { TRect } from './types'

export const TOOLBAR_HEIGHT = 50

export type TToolbar = {
  itemsToSave: TItem[],
} & TOmitKey<TRect, 'height'>

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapStoreDispatch,
  mapHandlers({
    onSave: ({ dispatch, itemsToSave }) => () => {
      dispatch(actionSave(itemsToSave))
    },
  })
)(({ top, left, width, onSave }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={TOOLBAR_HEIGHT}
  >
    <button onClick={onSave}>save</button>
  </Block>
))
