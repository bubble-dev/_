import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import { isUndefined } from 'tsfn'
import { mapStoreState } from '../store'
import { Block } from './Block'
import { TRect } from '../types'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { SnapshotDiff } from './SnapshotDiff'
import { SnapshotDeleted } from './SnapshotDeleted'
import { SnapshotNew } from './SnapshotNew'
import { ScreenshotDeleted } from './ScreenshotDeleted'

export type TPreview = TRect

export const Preview = component(
  startWithType<TPreview>(),
  mapStoreState(({ type, selectedItem }) => ({
    type,
    selectedItem,
  }), ['selectedItem', 'type']),
  mapWithProps(({ width, height }) => ({
    halfWidth: width / 2,
    halfHeight: height / 2,
  }))
)(({ top, left, width, height, halfWidth, halfHeight, type, selectedItem, files }) => {
  return (
    <Block
      top={top}
      left={left}
      width={width}
      height={height}
    >
      <h2>preview:</h2>
      {!isUndefined(type) && selectedItem !== null && !isUndefined(files) && (
        <Fragment>
          {selectedItem.type === 'new' && type === 'image' && (
            <ScreenshotNew
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={halfHeight}
              left={halfWidth}
              width={files[selectedItem.file].new[selectedItem.props].width}
              height={files[selectedItem.file].new[selectedItem.props].height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'diff' && type === 'image' && (
            <ScreenshotDiff
              key={`${selectedItem.file}:diff:${selectedItem.props}`}
              top={halfHeight}
              left={halfWidth}
              file={selectedItem.file}
              oldWidth={files[selectedItem.file].old[selectedItem.props].width}
              oldHeight={files[selectedItem.file].old[selectedItem.props].height}
              newWidth={files[selectedItem.file].new[selectedItem.props].width}
              newHeight={files[selectedItem.file].new[selectedItem.props].height}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'deleted' && type === 'image' && (
            <ScreenshotDeleted
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={halfHeight}
              left={halfWidth}
              width={files[selectedItem.file].old[selectedItem.props].width}
              height={files[selectedItem.file].old[selectedItem.props].height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'new' && type === 'text' && (
            <SnapshotNew
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={68}
              left={0}
              width={width}
              height={height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'diff' && type === 'text' && (
            <SnapshotDiff
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={68}
              left={0}
              width={width}
              height={height}
              file={selectedItem.file}
              props={selectedItem.props}
            />
          )}

          {selectedItem.type === 'deleted' && type === 'text' && (
            <SnapshotDeleted
              key={`${selectedItem.file}:new:${selectedItem.props}`}
              top={68}
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
