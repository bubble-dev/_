import React, { ReactNode } from 'react'
import { component, startWithType, mapHandlers, mapWithPropsMemo } from 'refun'
import bsc from 'bsc'
import { Border } from '@primitives/border'
import { isUndefined, isDefined } from 'tsfn'
import { mapStoreDispatch } from '../../store'
import { actionSelectSnapshot } from '../../actions'
import { TSize, TSnapshotGridItem, TSnapshotItem, TItem } from '../../types'
import { Block } from '../Block'
import { SnapshotGridItem } from '../SnapshotGridItem'
import { COL_SPACE, COL_WIDTH, SNAPSHOT_GRID_LINE_HEIGHT } from '../../config'
import { mapScrollState } from './map-scroll-state'
import { isVisibleItem } from './is-visible-item'

export type TSnapshotGrid = TSize & {
  items: TSnapshotItem[],
  discardedItems: TItem[],
}

export const SnapshotGrid = component(
  startWithType<TSnapshotGrid>(),
  mapStoreDispatch,
  mapWithPropsMemo(({ width, items }) => {
    const colCount = Math.max(1, Math.floor((width - COL_SPACE) / (COL_WIDTH + COL_SPACE)))
    const gridWidth = (width - (COL_SPACE * (colCount + 1))) / colCount
    const top = new Array(colCount).fill(COL_SPACE)
    const cols: TSnapshotGridItem[][] = new Array(colCount)
      .fill(0)
      .map(() => [])

    items.forEach((item) => {
      let minIndex = 0

      for (let i = 1; i < top.length; ++i) {
        if (top[i] < top[minIndex]) {
          minIndex = i
        }
      }

      const gridHeight = item.height * SNAPSHOT_GRID_LINE_HEIGHT

      const result: TSnapshotGridItem = {
        ...item,
        gridWidth,
        gridHeight,
        top: top[minIndex],
        left: minIndex * (gridWidth + COL_SPACE) + COL_SPACE,
      }

      cols[minIndex].push(result)

      top[minIndex] += gridHeight + COL_SPACE
    })

    let maxIndex = 0

    for (let i = 1; i < top.length; ++i) {
      if (top[i] > top[maxIndex]) {
        maxIndex = i
      }
    }

    return {
      cols,
      maxHeight: top[maxIndex],
    }
  }, ['width', 'items']),
  mapScrollState(),
  mapHandlers({
    onPress: ({ dispatch, scrollTop, cols }) => (x: number, y: number) => {
      for (let colIndex = 0; colIndex < cols.length; ++colIndex) {
        const firstItem = cols[colIndex][0]

        if (!isUndefined(firstItem) && (x < firstItem.left || firstItem.left + firstItem.gridWidth < x)) {
          continue
        }

        const itemIndex = bsc(cols[colIndex], (item: any) => {
          if (y + scrollTop < item.top) {
            return -1
          }

          if (y + scrollTop > item.top + item.gridHeight) {
            return 1
          }

          return 0
        })

        if (itemIndex >= 0) {
          const item = cols[colIndex][itemIndex]

          dispatch(actionSelectSnapshot({
            ...item,
            top: item.top - scrollTop,
          }))
        }
      }
    },
  })
)(({
  cols,
  discardedItems,
  maxHeight,
  width,
  height,
  scrollTop,
  prevScrollTop,
  onScroll,
  onPress,
}) => (
  <Block
    left={0}
    top={0}
    width={width}
    height={height}
    shouldScroll
    onScroll={onScroll}
    onPress={onPress}
  >
    <Block left={0} top={0} width={0} height={maxHeight} shouldFlow/>
    {cols.reduce((result, col) => (
      result.concat(
        col.map((item: TSnapshotGridItem) => {
          const isVisible = isVisibleItem(item, scrollTop, height)
          const isNew = prevScrollTop !== null && ((item.top + item.gridHeight < prevScrollTop) || (item.top > prevScrollTop + height))
          const key = `${item.file}:${item.type}:${item.id}`

          if (isVisible && isNew) {
            return (
              <Block
                key={key}
                top={item.top}
                left={item.left}
                width={item.gridWidth}
                height={item.gridHeight}
              >
                <Border
                  color={[0, 0, 0, 1]}
                  topWidth={2}
                  leftWidth={2}
                  rightWidth={2}
                  bottomWidth={2}
                  overflowLeft={2}
                  overflowRight={2}
                  overflowTop={2}
                  overflowBottom={2}
                />
              </Block>
            )
          }

          if (isVisible) {
            const isDiscarded = isDefined(discardedItems.find((discarded) => discarded.file === item.file && discarded.id === item.id))

            return (
              <SnapshotGridItem
                key={key}
                top={item.top}
                left={item.left}
                width={item.gridWidth}
                height={item.gridHeight}
                file={item.file}
                id={item.id}
                type={item.type}
                isDiscarded={isDiscarded}
              />
            )
          }
        })
      )
    ), [] as ReactNode[])}
  </Block>
))

SnapshotGrid.displayName = 'SnapshotGrid'
