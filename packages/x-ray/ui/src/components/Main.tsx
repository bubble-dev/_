import React from 'react'
import { component, startWithType, mapHandlers, mapThrottledHandlerTimeout, mapState, mapWithPropsMemo } from 'refun'
import { TColor } from 'colorido'
import { mapStoreState, mapStoreDispatch } from '../store'
import {
  actionLoadList,
  actionSelect,
  actionToggleAsStaged,
  actionToggleAsUnstaged,
  actionMoveToUnstaged,
  actionMoveToStaged,
  actionChangeStagedPage,
  actionChangeUnstagedPage,
} from '../actions'
import { TItem } from '../types'
import { TSize } from './types'
import { Toolbar, TOOLBAR_HEIGHT } from './Toolbar'
import { List } from './List'
import { Preview } from './Preview'
import { Background } from './Background'
import { Props } from './Props'
import { Block } from './Block'
import { BlockRef } from './BlockRef'

const COL_WIDTH = 100
const COL_SPACE = 20
const BORDER_SIZE = 2
const BORDER_COLOR = [0, 0, 0, 1] as TColor

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapWithPropsMemo(() => ({
    items: new Array(10000)
      .fill(0)
      .map(() => ({
        top: 0,
        left: 0,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 100,
      })),
  }), []),
  mapWithPropsMemo(({ width, items }) => {
    const colCount = Math.floor((width + COL_SPACE) / (COL_WIDTH + COL_SPACE))
    const top = new Array(colCount).fill(0)
    const cols: any[] = new Array(colCount)
      .fill(0)
      .map(() => [])

    items
      .map((item) => {
        const itemWidth = ((width - (COL_SPACE * (colCount - 1))) / colCount)
        const itemHeight = item.width / itemWidth * item.height

        const result = {
          ...item,
          width: itemWidth,
          height: itemHeight,
        }

        return result
      })
      .forEach((item) => {
        let minIndex = 0

        for (let i = 1; i < top.length; ++i) {
          if (top[i] < top[minIndex]) {
            minIndex = i
          }
        }

        item.top = top[minIndex]
        item.left = minIndex * (item.width + COL_SPACE)

        cols[minIndex].push(item)

        top[minIndex] += item.height + COL_SPACE
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
  }, ['width']),
  mapState('scrollTop', 'setScrollTop', () => 0, []),
  mapHandlers(({
    onScroll: ({ setScrollTop }) => (scrollTop) => {
      setScrollTop(scrollTop)
    },
  })),
  mapThrottledHandlerTimeout('onScroll', 50)
)(({ cols, maxHeight, width, height, scrollTop, onScroll }) => (
  <Block left={0} top={0} width={width} height={height} shouldScroll onScroll={onScroll}>
    <Block left={0} top={0} width={0} height={maxHeight} shouldFlow/>
    {cols.reduce((result, col, i) => (
      result.concat(
        col.map((item: any, j: number) => (
          (item.top + item.height > scrollTop - 100) && (item.top < scrollTop + height + 100) && (
            <Background
              key={`${i}_${j}`}
              top={item.top}
              left={item.left}
              width={item.width}
              height={item.height}
              color={[0, 0, 0, 1]}
            />
          )
        ))
      )
    ), [])}
  </Block>
))

// export const Main = component(
//   startWithType<TMain>(),
//   mapStoreState(({ itemsToStage, itemsToUnstage, stagedItems, unstagedItems, stagedPageIndex, unstagedPageIndex }) => ({
//     itemsToStage,
//     itemsToUnstage,
//     unstagedItems,
//     stagedItems,
//     stagedPageIndex,
//     unstagedPageIndex,
//   }), ['itemsToStage', 'itemsToUnstage', 'stagedItems', 'unstagedItems', 'stagedPageIndex', 'unstagedPageIndex']),
//   mapStoreDispatch,
//   onMount(({ dispatch }) => {
//     dispatch(actionLoadList())
//   }),
//   mapHandlers({
//     onSelect: ({ dispatch }) => (item: TItem) => {
//       dispatch(actionSelect(item))
//     },
//     onToggleAsStaged: ({ dispatch }) => (item: TItem) => {
//       dispatch(actionToggleAsStaged(item))
//     },
//     onToggleAsUnstaged: ({ dispatch }) => (item: TItem) => {
//       dispatch(actionToggleAsUnstaged(item))
//     },
//     onMoveToUnstaged: ({ dispatch }) => () => {
//       dispatch(actionMoveToUnstaged())
//     },
//     onMoveToStaged: ({ dispatch }) => () => {
//       dispatch(actionMoveToStaged())
//     },
//     onStagedPageChange: ({ dispatch }) => (index: number) => {
//       dispatch(actionChangeStagedPage(index))
//     },
//     onUnstagedPageChange: ({ dispatch }) => (index: number) => {
//       dispatch(actionChangeUnstagedPage(index))
//     },
//   }),
//   mapWithProps(({ width, height }) => ({
//     stagedTop: TOOLBAR_HEIGHT + BORDER_SIZE,
//     stagedHeight: (height - TOOLBAR_HEIGHT - BORDER_SIZE * 2) / 2,
//     stagedWidth: (width - BORDER_SIZE) / 2,
//   })),
//   mapWithProps(({ stagedTop, stagedWidth, stagedHeight }) => ({
//     unstagedTop: stagedTop + stagedHeight + BORDER_SIZE,
//     unstagedHeight: stagedHeight,
//     unstagedWidth: stagedWidth,
//   })),
//   mapWithProps(({ width, height }) => ({
//     propsTop: TOOLBAR_HEIGHT + BORDER_SIZE,
//     propsLeft: (width - BORDER_SIZE) / 2 + BORDER_SIZE,
//     propsWidth: (width - BORDER_SIZE) / 2,
//     propsHeight: (height - TOOLBAR_HEIGHT - BORDER_SIZE * 2) / 2,
//   })),
//   mapWithProps(({ propsHeight, propsWidth, propsLeft, propsTop }) => ({
//     previewTop: propsTop + propsHeight + BORDER_SIZE,
//     previewLeft: propsLeft,
//     previewWidth: propsWidth,
//     previewHeight: propsHeight,
//   })),
//   mapWithProps(({ width, height }) => ({
//     verticalSeparatorTop: TOOLBAR_HEIGHT + BORDER_SIZE,
//     verticalSeparatorLeft: (width - BORDER_SIZE) / 2,
//     verticalSeparatorHeight: height - TOOLBAR_HEIGHT - BORDER_SIZE,
//     horizontalSeparatorTop: (height - TOOLBAR_HEIGHT - BORDER_SIZE * 2) / 2 + TOOLBAR_HEIGHT + BORDER_SIZE,
//     horizontalSeparatorWidth: width,
//   }))
// )(({
//   width,
//   itemsToStage,
//   itemsToUnstage,
//   stagedItems,
//   unstagedItems,
//   stagedPageIndex,
//   unstagedPageIndex,
//   stagedTop,
//   stagedWidth,
//   stagedHeight,
//   unstagedTop,
//   unstagedWidth,
//   unstagedHeight,
//   previewTop,
//   previewLeft,
//   previewWidth,
//   previewHeight,
//   propsTop,
//   propsLeft,
//   propsWidth,
//   propsHeight,
//   verticalSeparatorTop,
//   verticalSeparatorLeft,
//   verticalSeparatorHeight,
//   horizontalSeparatorTop,
//   horizontalSeparatorWidth,
//   onMoveToStaged,
//   onMoveToUnstaged,
//   onSelect,
//   onToggleAsStaged,
//   onToggleAsUnstaged,
//   onStagedPageChange,
//   onUnstagedPageChange,
// }) => (
//   <Fragment>
//     <Toolbar
//       top={0}
//       left={0}
//       width={width}
//       itemsToSave={stagedItems}
//     />
//     <Border
//       top={TOOLBAR_HEIGHT}
//       left={0}
//       width={width}
//       height={BORDER_SIZE}
//       color={BORDER_COLOR}
//     />
//     <List
//       title="staged"
//       items={stagedItems}
//       itemsToMove={itemsToUnstage}
//       pageIndex={stagedPageIndex}
//       top={stagedTop}
//       left={0}
//       width={stagedWidth}
//       height={stagedHeight}
//       onSelect={onSelect}
//       onToggle={onToggleAsUnstaged}
//       onMove={onMoveToUnstaged}
//       onPageChange={onStagedPageChange}
//     />
//     <Border
//       top={horizontalSeparatorTop}
//       left={0}
//       width={horizontalSeparatorWidth}
//       height={BORDER_SIZE}
//       color={BORDER_COLOR}
//     />
//     <List
//       title="unstaged"
//       items={unstagedItems}
//       itemsToMove={itemsToStage}
//       pageIndex={unstagedPageIndex}
//       left={0}
//       top={unstagedTop}
//       width={unstagedWidth}
//       height={unstagedHeight}
//       onSelect={onSelect}
//       onToggle={onToggleAsStaged}
//       onMove={onMoveToStaged}
//       onPageChange={onUnstagedPageChange}
//     />
//     <Border
//       top={verticalSeparatorTop}
//       left={verticalSeparatorLeft}
//       width={BORDER_SIZE}
//       height={verticalSeparatorHeight}
//       color={BORDER_COLOR}
//     />
//     <Props
//       top={propsTop}
//       left={propsLeft}
//       width={propsWidth}
//       height={propsHeight}
//     />
//     <Preview
//       top={previewTop}
//       left={previewLeft}
//       width={previewWidth}
//       height={previewHeight}
//     />
//   </Fragment>
// ))
