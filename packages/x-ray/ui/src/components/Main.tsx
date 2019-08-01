import React, { Fragment } from 'react'
import { component, onMount, startWithType, mapHandlers, mapWithProps } from 'refun'
import { mapStoreState, mapStoreDispatch } from '../store'
import { actionLoadList, actionMoveToUnstaged, actionMoveToStaged, actionSelect } from '../actions'
import { Toolbar, TOOLBAR_HEIGHT } from './Toolbar'
import { List } from './List'
import { Preview } from './Preview'

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
    onSelect: ({ dispatch }) => (file: string, item: string, type: string) => {
      dispatch(actionSelect({ file, item, type }))
    },
    onMoveToUnstaged: ({ dispatch }) => (file) => {
      dispatch(actionMoveToUnstaged(file))
    },
    onMoveToStaged: ({ dispatch }) => (file) => {
      dispatch(actionMoveToStaged(file))
    },
  }),
  mapWithProps(({ width, height }) => ({
    stagedTop: TOOLBAR_HEIGHT,
    stagedHeight: (height - TOOLBAR_HEIGHT) / 2,
    stagedWidth: width / 2,
  })),
  mapWithProps(({ stagedTop, stagedWidth, stagedHeight }) => ({
    unstagedTop: stagedTop + stagedHeight,
    unstagedHeight: stagedHeight,
    unstagedWidth: stagedWidth,
  })),
  mapWithProps(({ width, height }) => ({
    previewTop: TOOLBAR_HEIGHT,
    previewLeft: width / 2,
    previewWidth: width / 2,
    previewHeight: height - TOOLBAR_HEIGHT,
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
    <Preview
      top={previewTop}
      left={previewLeft}
      width={previewWidth}
      height={previewHeight}
    />
  </Fragment>
))
