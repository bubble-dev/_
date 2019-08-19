import React, { Fragment, ReactNode } from 'react'
import { component, startWithType, mapHandlers, mapWithPropsMemo } from 'refun'
import bsc from 'bsc'
import { easeInOutCubic, Animation } from '@primitives/animation'
import { Border } from '@primitives/border'
import { isUndefined } from 'tsfn'
import { mapStoreDispatch } from '../../store'
import { actionSelectScreenshot } from '../../actions'
import { TSize, TScreenshotGridItem, TScreenshotItem } from '../../types'
import { Block } from '../Block'
import { ScreenshotNew } from '../ScreenshotNew'
import { ScreenshotDeleted } from '../ScreenshotDeleted'
import { ScreenshotDiff } from '../ScreenshotDiff'
import { COL_SPACE, COL_WIDTH } from '../../config'
import { mapDiffState } from './map-diff-state'
import { mapScrollState } from './map-scroll-state'
import { isVisibleItem } from './is-visible-item'

export type TScreenshotGrid = TSize & {
  items: TScreenshotItem[],
  shouldAnimate: boolean,
}

export const ScreenshotGrid = component(
  startWithType<TScreenshotGrid>(),
  mapStoreDispatch,
  mapWithPropsMemo(({ width, items }) => {
    const colCount = Math.max(1, Math.floor((width - COL_SPACE) / (COL_WIDTH + COL_SPACE)))
    const gridWidth = (width - (COL_SPACE * (colCount + 1))) / colCount
    const top = new Array(colCount).fill(COL_SPACE)
    const cols: TScreenshotGridItem[][] = new Array(colCount)
      .fill(0)
      .map(() => [])

    items.forEach((item) => {
      let minIndex = 0

      for (let i = 1; i < top.length; ++i) {
        if (top[i] < top[minIndex]) {
          minIndex = i
        }
      }

      let gridHeight: number

      if (item.type === 'diff') {
        const largestWidth = item.width > item.newWidth ? item.width : item.newWidth
        const largestHeight = item.height > item.newHeight ? item.height : item.newHeight

        gridHeight = gridWidth / largestWidth * largestHeight
      } else {
        gridHeight = gridWidth / item.width * item.height
      }

      const result: TScreenshotGridItem = {
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

          dispatch(actionSelectScreenshot({
            ...item,
            top: item.top - scrollTop,
          }))
        }
      }
    },
  }),
  mapDiffState()
)(({
  cols,
  maxHeight,
  width,
  height,
  scrollTop,
  prevScrollTop,
  diffState,
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
    <Animation values={[diffState ? 1 : 0]} time={200} easing={easeInOutCubic}>
      {([alpha]) => (
        <Fragment>
          {cols.reduce((result, col) => (
            result.concat(
              col.map((item: TScreenshotGridItem) => {
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
                  if (item.type === 'new') {
                    return (
                      <ScreenshotNew
                        key={key}
                        top={item.top}
                        left={item.left}
                        width={item.gridWidth}
                        height={item.gridHeight}
                        file={item.file}
                        id={item.id}
                      />
                    )
                  }

                  if (item.type === 'deleted') {
                    return (
                      <ScreenshotDeleted
                        key={key}
                        top={item.top}
                        left={item.left}
                        width={item.gridWidth}
                        height={item.gridHeight}
                        file={item.file}
                        id={item.id}
                      />
                    )
                  }

                  if (item.type === 'diff') {
                    const largestWidth = item.width > item.newWidth ? item.width : item.newWidth
                    const scale = item.gridWidth / largestWidth

                    return (
                      <ScreenshotDiff
                        key={key}
                        top={item.top}
                        left={item.left}
                        oldWidth={item.width * scale}
                        oldHeight={item.height * scale}
                        newWidth={item.newWidth * scale}
                        newHeight={item.newHeight * scale}
                        oldAlpha={1 - alpha}
                        newAlpha={alpha}
                        file={item.file}
                        id={item.id}
                      />
                    )
                  }
                }
              })
            )
          ), [] as ReactNode[])}
        </Fragment>
      )}
    </Animation>
  </Block>
))

ScreenshotGrid.displayName = 'ScreenshotGrid'
