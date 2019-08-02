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
  mapStoreState(({ kind, selectedFile, selectedItem, selectedType }) => ({
    kind,
    selectedFile,
    selectedItem,
    selectedType,
  }), ['selectedFile', 'selectedItem', 'selectedType', 'kind']),
  mapWithProps(({ width, height }) => ({
    fileTop: height / 2,
    fileLeft: width / 2,
  }))
)(({ top, left, width, height, fileLeft, fileTop, kind, selectedFile, selectedItem, selectedType }) => {
  if (isUndefined(kind) || isUndefined(selectedFile) || isUndefined(selectedItem) || isUndefined(selectedType)) {
    return null
  }

  return (
    <Block
      top={top}
      left={left}
      width={width}
      height={height}
    >
      {selectedType === 'new' && (
        <File
          key={`${selectedFile}:${selectedItem}:new`}
          kind={kind}
          file={selectedFile}
          item={selectedItem}
          type="new"
          top={fileTop}
          left={fileLeft}
        />
      )}

      {selectedType === 'diff' && (
        <Fragment>
          <File
            key={`${selectedFile}:${selectedItem}:old`}
            kind={kind}
            file={selectedFile}
            item={selectedItem}
            type="old"
            top={fileTop}
            left={fileLeft}
          />
          <File
            key={`${selectedFile}:${selectedItem}:new`}
            kind={kind}
            file={selectedFile}
            item={selectedItem}
            type="new"
            top={fileTop}
            left={fileLeft}
          />
        </Fragment>
      )}

      {selectedType === 'deleted' && (
        <File
          key={`${selectedFile}:${selectedItem}:old`}
          kind={kind}
          file={selectedFile}
          item={selectedItem}
          type="old"
          top={fileTop}
          left={fileLeft}
        />
      )}
    </Block>
  )
})
