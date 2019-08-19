import React, { Fragment } from 'react'
import { component, startWithType, onMount, mapHandlers } from 'refun'
import { Button } from '@primitives/button'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionLoadList, actionSave } from '../../actions'
import { TSize, TType, TScreenshotItem, TSnapshotItem } from '../../types'
import { Popup } from '../Popup'
import { Block } from '../Block'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const isScreenshots = (items: any[], type: TType | null): items is TScreenshotItem[] => type === 'image' && items.length > 0
const isSnapshots = (items: any[], type: TType | null): items is TSnapshotItem[] => type === 'text' && items.length > 0

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
      if (type !== null && items.length > 0) {
        dispatch(actionSave(type, items, discardedItems))
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
    <Block top={0} left={0}>
      <Button onPress={onSave}>Save</Button>
    </Block>
  </Fragment>
))

Main.displayName = 'Main'
