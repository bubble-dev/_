import React from 'react'
import { component, onMount, startWithType, mapHandlers, mapWithProps } from 'refun'
import { isUndefined } from 'tsfn'
import { mapStoreState, mapStoreDispatch } from '../store'
import { actionLoadList, actionMoveToUnstaged, actionMoveToStaged } from '../actions'
import { Toolbar, TOOLBAR_HEIGHT } from './Toolbar'
import { Block } from './Block'
import { List } from './List'

export type TMain = {
  width: number,
  height: number,
}

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ kind, files, unstagedList, stagedList }) => ({
    kind,
    files,
    unstagedList,
    stagedList,
  }), ['kind', 'files', 'unstagedList', 'stagedList']),
  mapStoreDispatch,
  onMount(({ dispatch }) => {
    dispatch(actionLoadList())
  }),
  mapHandlers({
    onStagedClick: ({ dispatch }) => (file) => {
      dispatch(actionMoveToUnstaged(file))
    },
    onUnstagedClick: ({ dispatch }) => (file) => {
      dispatch(actionMoveToStaged(file))
    },
  }),
  mapWithProps(({ width, height }) => ({
    stagedTop: TOOLBAR_HEIGHT,
    stagedHeight: (height - TOOLBAR_HEIGHT) / 2,
    stagedWidth: width,
  })),
  mapWithProps(({ stagedTop, stagedWidth, stagedHeight }) => ({
    unstagedTop: stagedTop + stagedHeight,
    unstagedHeight: stagedHeight,
    unstagedWidth: stagedWidth,
  }))
)(({
  kind,
  width,
  files,
  stagedList,
  unstagedList,
  stagedTop,
  stagedWidth,
  stagedHeight,
  unstagedTop,
  unstagedWidth,
  unstagedHeight,
  onStagedClick,
  onUnstagedClick,
}) => {
  if (isUndefined(files) || isUndefined(kind)) {
    return null
  }

  return (
    <Block>
      <Toolbar
        top={0}
        left={0}
        width={width}
      />
      <List
        title="staged"
        files={files}
        list={stagedList}
        kind={kind}
        top={stagedTop}
        left={0}
        width={stagedWidth}
        height={stagedHeight}
        onClick={onStagedClick}
      />
      <List
        title="unstaged"
        files={files}
        list={unstagedList}
        kind={kind}
        left={0}
        top={unstagedTop}
        width={unstagedWidth}
        height={unstagedHeight}
        onClick={onUnstagedClick}
      />
    </Block>
  )
})
