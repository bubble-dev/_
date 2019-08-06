import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import { isUndefined } from 'tsfn'
import { mapStoreState } from '../store'
import { Block } from './Block'
import { TRect } from './types'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { SnapshotDiff } from './SnapshotDiff'
import { SnapshotDeleted } from './SnapshotDeleted'
import { SnapshotNew } from './SnapshotNew'
import { ScreenshotDeleted } from './ScreenshotDeleted'

export type TPreview = TRect

export const Preview = component(
  startWithType<TPreview>(),
  mapStoreState(({ kind, selectedItem }) => ({
    kind,
    selectedItem,
  }), ['selectedItem', 'kind']),
  mapWithProps(({ width, height }) => ({
    fileTop: height / 2,
    fileLeft: width / 2,
  }))
)(({ top, left, width, height, fileLeft, fileTop, kind, selectedItem }) => {
  return (
    <Block
      top={top}
      left={left}
      width={width}
      height={height}
    >
      <h2>preview:</h2>
      {!isUndefined(kind) && !isUndefined(selectedItem) && (
        <Fragment>
          {selectedItem.type === 'new' && kind === 'image' && (
            <ScreenshotNew
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={fileTop}
              left={fileLeft}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'diff' && kind === 'image' && (
            <ScreenshotDiff
              key={`${selectedItem.file}:diff:${selectedItem.props}`}
              top={fileTop}
              left={fileLeft}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'deleted' && kind === 'image' && (
            <ScreenshotDeleted
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={fileTop}
              left={fileLeft}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'new' && kind === 'text' && (
            <SnapshotNew
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={0}
              left={0}
              width={width}
              height={height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'diff' && kind === 'text' && (
            <SnapshotDiff
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={0}
              left={0}
              width={width}
              height={height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'deleted' && kind === 'text' && (
            <SnapshotDeleted
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={0}
              left={0}
              width={width}
              height={height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}
        </Fragment>
      )}
    </Block>
  )
})
