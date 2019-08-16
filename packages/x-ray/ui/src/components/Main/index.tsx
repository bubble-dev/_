import React, { Fragment } from 'react'
import { component, startWithType, onMount, mapHandlers } from 'refun'
import { isDefined } from 'tsfn'
import { Button } from '@primitives/button'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionLoadList, actionSave } from '../../actions'
import { TSize, TType, TScreenshotItem, TSnapshotItem } from '../../types'
import { Popup } from '../Popup'
import { Block } from '../Block'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const isScreenshots = (type?: TType, items?: any): items is TScreenshotItem[] => type === 'image' && isDefined(items)
const isSnapshots = (type?: TType, items?: any): items is TSnapshotItem[] => type === 'text' && isDefined(items)

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ type, selectedItem, items }) => ({
    type,
    selectedItem,
    items,
  }), ['selectedItem', 'items', 'type']),
  mapStoreDispatch,
  onMount(({ dispatch }) => {
    dispatch(actionLoadList())
  }),
  mapHandlers({
    onSave: ({ type, items, dispatch }) => () => {
      if (isDefined(type) && isDefined(items)) {
        dispatch(actionSave(type, items))
      }
    },
  })
)(({
  width,
  height,
  selectedItem,
  items,
  type,
  onSave,
}) => (
  <Fragment>
    {isScreenshots(type, items) && (
      <ScreenshotGrid
        width={width}
        height={height}
        items={items}
        shouldAnimate={selectedItem !== null}
      />
    )}
    {isSnapshots(type, items) && (
      <SnapshotGrid
        width={width}
        height={height}
        items={items}
      />
    )}
    {isDefined(type) && selectedItem !== null && (
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
