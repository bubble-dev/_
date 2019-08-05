import React from 'react'
import { component, startWithType } from 'refun'
import { mapStoreState } from '../store'
import { TItem } from '../types'
import { isEqualItems } from '../utils'
import { Block } from './Block'
import { TRect } from './types'

export type TList = {
  title: string,
  items: TItem[],
  onSelect: (item: TItem) => void,
  onMove: (item: TItem) => void,
} & TRect

export const List = component(
  startWithType<TList>(),
  mapStoreState(({ selectedItem }) => ({
    selectedItem,
  }), ['selectedItem'])
)(({
  items,
  title,
  selectedItem,
  top,
  left,
  width,
  height,
  onSelect,
  onMove,
}) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    shouldScroll
  >
    <h2>{title}:</h2>
    <ul>
      {
        items.map((item) => {
          const { file, type, name } = item
          const isSelected = selectedItem && isEqualItems(selectedItem, item)

          return (
            <li style={{ backgroundColor: isSelected ? '#eee' : '#fff' }} key={`${file}:${type}:${name}`}>
              <h4
                onClick={() => onSelect(item)}
                onDoubleClick={() => onMove(item)}
              >
                {file}: {type}: {name}
              </h4>
            </li>
          )
        })
      }
    </ul>
  </Block>
))
