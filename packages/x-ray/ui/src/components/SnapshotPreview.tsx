import React from 'react'
import { component, startWithType } from 'refun'
import { TRect, TSnapshotGridItem } from '../types'
import { Block } from './Block'
import { SnapshotGridItem } from './SnapshotGridItem'

export type TSnapshotPreview = TRect & {
  item: TSnapshotGridItem,
}

export const SnapshotPreview = component(
  startWithType<TSnapshotPreview>()
)(({ top, left, width, height, item }) => (
  <Block top={top} left={left} width={width} height={height}>
    <SnapshotGridItem
      key={`${item.file}:${item.type}:${item.id}`}
      top={68}
      left={0}
      width={width}
      height={height}
      file={item.file}
      id={item.id}
      type={item.type}
    />
  </Block>
))
