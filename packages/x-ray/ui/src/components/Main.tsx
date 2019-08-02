import React, { Fragment } from 'react'
import { component, onMount, startWithType, mapHandlers, mapWithProps } from 'refun'
import { TColor } from 'colorido'
import { mapStoreState, mapStoreDispatch } from '../store'
import { actionLoadList, actionMoveToUnstaged, actionMoveToStaged, actionSelect } from '../actions'
import { TResultType } from '../types'
import { Toolbar, TOOLBAR_HEIGHT } from './Toolbar'
import { List } from './List'
import { Preview } from './Preview'
import { Border } from './Border'

const BORDER_SIZE = 1
const BORDER_COLOR = [0, 0, 0, 1] as TColor

export type TMain = {
  width: number,
  height: number,
}

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ unstagedList, stagedList }) => ({
    unstagedList,
    stagedList,
  }), ['files', 'unstagedList', 'stagedList']),
  mapStoreDispatch,
  onMount(({ dispatch }) => {
    dispatch(actionLoadList())
  }),
  mapHandlers({
    onSelect: ({ dispatch }) => (file: string, item: string, type: TResultType) => {
      dispatch(actionSelect({ file, item, type }))
    },
    onMoveToUnstaged: ({ dispatch }) => (file: string, item: string, type: TResultType) => {
      dispatch(actionMoveToUnstaged({ file, item, type }))
    },
    onMoveToStaged: ({ dispatch }) => (file: string, item: string, type: TResultType) => {
      dispatch(actionMoveToStaged({ file, item, type }))
    },
  }),
  mapWithProps(({ width, height }) => ({
    stagedTop: TOOLBAR_HEIGHT + BORDER_SIZE,
    stagedHeight: (height - TOOLBAR_HEIGHT - BORDER_SIZE * 2) / 2,
    stagedWidth: (width - BORDER_SIZE) / 2,
  })),
  mapWithProps(({ stagedTop, stagedWidth, stagedHeight }) => ({
    unstagedTop: stagedTop + stagedHeight + BORDER_SIZE,
    unstagedHeight: stagedHeight,
    unstagedWidth: stagedWidth,
  })),
  mapWithProps(({ width, height }) => ({
    previewTop: TOOLBAR_HEIGHT + BORDER_SIZE,
    previewLeft: (width - BORDER_SIZE) / 2 + BORDER_SIZE,
    previewWidth: (width - BORDER_SIZE) / 2,
    previewHeight: height - TOOLBAR_HEIGHT - BORDER_SIZE,
  }))
)(({
  width,
  stagedList,
  unstagedList,
  stagedTop,
  stagedWidth,
  stagedHeight,
  unstagedTop,
  unstagedWidth,
  unstagedHeight,
  previewTop,
  previewLeft,
  previewWidth,
  previewHeight,
  onSelect,
  onMoveToStaged,
  onMoveToUnstaged,
}) => (
  <Fragment>
    <Toolbar
      top={0}
      left={0}
      width={width}
    />
    <Border
      top={TOOLBAR_HEIGHT}
      left={0}
      width={width}
      height={BORDER_SIZE}
      color={BORDER_COLOR}
    />
    <List
      title="staged"
      list={stagedList}
      top={stagedTop}
      left={0}
      width={stagedWidth}
      height={stagedHeight}
      onSelect={onSelect}
      onMove={onMoveToUnstaged}
    />
    <Border
      top={unstagedTop - BORDER_SIZE}
      left={0}
      width={unstagedWidth}
      height={BORDER_SIZE}
      color={BORDER_COLOR}
    />
    <List
      title="unstaged"
      list={unstagedList}
      left={0}
      top={unstagedTop}
      width={unstagedWidth}
      height={unstagedHeight}
      onSelect={onSelect}
      onMove={onMoveToStaged}
    />
    <Border
      top={previewTop}
      left={previewLeft - BORDER_SIZE}
      width={BORDER_SIZE}
      height={previewHeight}
      color={BORDER_COLOR}
    />
    <Preview
      top={previewTop}
      left={previewLeft}
      width={previewWidth}
      height={previewHeight}
    />
  </Fragment>
))
