import React, { Fragment } from 'react'
import { component, startWithType } from 'refun'
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
  }), ['selectedFile', 'selectedItem', 'selectedType', 'kind'])
)(({ top, left, width, height, kind, selectedFile, selectedItem, selectedType }) => {
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
      <Block top={height / 2} left={width / 2}>
        {selectedType === 'new' && (
          <File
            key={`${selectedFile}:${selectedItem}:new`}
            kind={kind}
            file={selectedFile}
            item={selectedItem}
            type="new"
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
            />
            <File
              key={`${selectedFile}:${selectedItem}:new`}
              kind={kind}
              file={selectedFile}
              item={selectedItem}
              type="new"
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
          />
        )}
      </Block>
    </Block>
  )
})
