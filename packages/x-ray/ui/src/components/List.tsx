import React from 'react'
import { component, startWithType } from 'refun'
import { mapStoreState } from '../store'
import { TItem } from '../types'
import { isEqualItems, hasItem } from '../utils'
import { ITEMS_PER_PAGE } from '../config'
import { Block } from './Block'
import { TRect } from './types'

export type TList = {
  title: string,
  items: TItem[],
  itemsToMove: TItem[],
  pageIndex: number,
  onMove: () => void,
  onSelect: (item: TItem) => void,
  onToggle: (item: TItem) => void,
  onPageChange: (index: number) => void,
} & TRect

export const List = component(
  startWithType<TList>(),
  mapStoreState(({ selectedItem }) => ({
    selectedItem,
  }), ['selectedItem'])
)(({
  items,
  itemsToMove,
  pageIndex,
  title,
  selectedItem,
  top,
  left,
  width,
  height,
  onMove,
  onSelect,
  onToggle,
  onPageChange,
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
        new Array(Math.ceil(items.length / ITEMS_PER_PAGE))
          .fill(0)
          .map((_, i) => {
            return (
              <button
                key={i}
                disabled={pageIndex === i}
                onClick={() => onPageChange(i)}
              >
                {i + 1}
              </button>
            )
          })
      }
      {
        items.slice(pageIndex * ITEMS_PER_PAGE, pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map((item, i) => {
          const { file, type, props } = item
          const isSelected = selectedItem && isEqualItems(selectedItem, item)
          const isChecked = hasItem(itemsToMove, item)

          return (
            <li style={{ backgroundColor: isSelected ? '#eee' : '#fff' }} key={`${file}:${type}:${props}`}>
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
