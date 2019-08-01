import React from 'react'
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
)(({ top, left, width, height, kind, selectedFile, selectedItem, selectedType }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
  >
    {!isUndefined(kind) && !isUndefined(selectedFile) && !isUndefined(selectedItem) && !isUndefined(selectedType) && (
      <File
        key={`${selectedFile}:${selectedItem}:${selectedType}`}
        kind={kind}
        file={selectedFile}
        item={selectedItem}
        type={selectedType}
      />
    )}
  </Block>
))
