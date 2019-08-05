import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import { isUndefined } from 'tsfn'
import { mapStoreState } from '../store'
import { Block } from './Block'
import { File } from './File'
import { TRect } from './types'

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
          {selectedItem.type === 'new' && (
          <File
            key={`${selectedItem.file}:new:${selectedItem.name}`}
            kind={kind}
            file={selectedItem.file}
            item={selectedItem.name}
            type="new"
            top={fileTop}
            left={fileLeft}
          />
          )}

          {selectedItem.type === 'diff' && (
          <Fragment>
            <File
              key={`${selectedItem.file}:old:${selectedItem.name}`}
              kind={kind}
              file={selectedItem.file}
              item={selectedItem.name}
              type="old"
              top={fileTop}
              left={fileLeft}
            />
            <File
              key={`${selectedItem.file}:new:${selectedItem.name}`}
              kind={kind}
              file={selectedItem.file}
              item={selectedItem.name}
              type="new"
              top={fileTop}
              left={fileLeft}
            />
          </Fragment>
          )}

          {selectedItem.type === 'deleted' && (
          <File
            key={`${selectedItem.file}:old:${selectedItem.name}`}
            kind={kind}
            file={selectedItem.file}
            item={selectedItem.name}
            type="old"
            top={fileTop}
            left={fileLeft}
          />
          )}
        </Fragment>
      )}
    </Block>
  )
})
