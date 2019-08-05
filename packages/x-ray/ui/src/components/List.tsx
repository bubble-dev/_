import React from 'react'
import { component, startWithType } from 'refun'
import { mapStoreState } from '../store'
import { TItem } from '../types'
import { isEqualItems, hasItem } from '../utils'
import { Block } from './Block'
import { TRect } from './types'

export type TList = {
  title: string,
  items: TItem[],
  itemsToMove: TItem[],
  onMove: () => void,
  onSelect: (item: TItem) => void,
  onToggle: (item: TItem) => void,
} & TRect

export const List = component(
  startWithType<TList>(),
  mapStoreState(({ selectedItem }) => ({
    selectedItem,
  }), ['selectedItem'])
)(({
  items,
  itemsToMove,
  title,
  selectedItem,
  top,
  left,
  width,
  height,
  onMove,
  onSelect,
  onToggle,
}) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    shouldScroll
  >
    <h2>{title}:</h2>
    <button disabled={itemsToMove.length === 0} onClick={onMove}>move</button>
    <ul>
      {
        items.map((item, i) => {
          const { file, type, name } = item
          const isSelected = selectedItem && isEqualItems(selectedItem, item)
          const isChecked = hasItem(itemsToMove, item)

          return (
            <li style={{ backgroundColor: isSelected ? '#eee' : '#fff' }} key={`${file}:${type}:${name}`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(item)}
              />
              <span onClick={() => onSelect(item)}>
                [{type}] {file}: {String(i).padStart(6, '0')}
              </span>
            </li>
          )
        })
      }
    </ul>
  </Block>
))
