import React, { Fragment } from 'react'
import { component, startWithType, onMount, mapHandlers } from 'refun'
import { Button } from '@primitives/button'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionLoadList, actionSave } from '../../actions'
import { TSize, TType, TScreenshotItems, TSnapshotItems } from '../../types'
import { Popup } from '../Popup'
import { Block } from '../Block'
import { Background } from '../Background'
import { COLOR_BLACK } from '../../config'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const SAVE_BUTTON_SIZE = 48

const isScreenshots = (items: any, type: TType | null): items is TScreenshotItems => type === 'image' && Object.keys(items).length > 0
const isSnapshots = (items: any, type: TType | null): items is TSnapshotItems => type === 'text' && Object.keys(items).length > 0

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ type, selectedItem, items, discardedItems }) => ({
    type,
    selectedItem,
    items,
    discardedItems,
  }), ['selectedItem', 'items', 'type', 'discardedItems']),
  mapStoreDispatch,
  onMount(({ dispatch }) => {
    dispatch(actionLoadList())
  }),
  mapHandlers({
    onSave: ({ type, items, discardedItems, dispatch }) => () => {
      const itemKeys = Object.keys(items)

      if (type !== null && itemKeys.length > 0) {
        dispatch(actionSave(itemKeys, discardedItems))
      }
    },
  })
)(({
  width,
  height,
  selectedItem,
  items,
  discardedItems,
  type,
  onSave,
}) => (
  <Fragment>
    {isScreenshots(items, type) && (
      <ScreenshotGrid
        width={width}
        height={height}
        items={items}
        discardedItems={discardedItems}
        shouldAnimate={selectedItem === null}
      />
    )}
    {isSnapshots(items, type) && (
      <SnapshotGrid
        width={width}
        height={height}
        items={items}
        discardedItems={discardedItems}
      />
    )}
    <Block
      top={height - SAVE_BUTTON_SIZE - 10}
      left={width - SAVE_BUTTON_SIZE - 10}
      width={SAVE_BUTTON_SIZE}
      height={SAVE_BUTTON_SIZE}
      style={{
        display: 'flex',
      }}
    >
      <Background color={COLOR_BLACK}/>
      <Button onPress={onSave}/>
    </Block>
    {type !== null && selectedItem !== null && (
      <Popup
        left={0}
        top={0}
        width={width}
        height={height}
        type={type}
        item={selectedItem}
      />
    )}
  </Fragment>
))

Main.displayName = 'Main'
