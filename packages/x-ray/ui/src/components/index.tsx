import React, { Fragment } from 'react'
import { component, onMount, startWithType, mapHandlers } from 'refun'
import { Root } from '@primitives/root'
import { isUndefined } from 'tsfn'
import { mapStoreState, mapStoreDispatch } from '../store'
import { actionLoadList, saveAction, actionMoveToUnstaged, actionMoveToStaged } from '../actions'
// import { Block } from './Block'
import { List } from './List'

export const Index = component(
  startWithType<{}>(),
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
    onSave: ({ dispatch }) => () => {
      dispatch(saveAction())
    },
    onStagedClick: ({ dispatch }) => (file) => {
      dispatch(actionMoveToUnstaged(file))
    },
    onUnstagedClick: ({ dispatch }) => (file) => {
      dispatch(actionMoveToStaged(file))
    },
  })
)(({ kind, files, stagedList, unstagedList, onSave, onStagedClick, onUnstagedClick }) => (
  <Root>
    {(/*{ width, height }*/) => (
      <div>
        {!isUndefined(files) && !isUndefined(kind) && (
          <Fragment>
            <div>
              <List
                title="staged"
                files={files}
                list={stagedList}
                kind={kind}
                onClick={onStagedClick}
              />
            </div>
            <div>
              <List
                title="unstaged"
                files={files}
                list={unstagedList}
                kind={kind}
                onClick={onUnstagedClick}
              />
            </div>
          </Fragment>
        )}
        <div>
          <button onClick={onSave}>save</button>
        </div>
      </div>
    )}
  </Root>
))
