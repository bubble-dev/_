import React, { Fragment, ReactNode } from 'react'
import { component, startWithType, mapHandlers, mapWithPropsMemo } from 'refun'
import bsc from 'bsc'
import { easeInOutCubic, Animation } from '@primitives/animation'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionSelect } from '../../actions'
import { TSize, TItemWithPosition } from '../../types'
import { Background } from '../Background'
import { Block } from '../Block'
import { Popup } from '../Popup'
import { ScreenshotNew } from '../ScreenshotNew'
import { ScreenshotDeleted } from '../ScreenshotDeleted'
import { ScreenshotDiff } from '../ScreenshotDiff'
import { mapDiffState } from './map-diff-state'
import { mapScrollState } from './map-scroll-state'
import { isVisibleItem } from './is-visible-item'

const COL_WIDTH = 100
const COL_SPACE = 20

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ selectedItem, items }) => ({
    selectedItem,
    items,
  }), ['selectedItem', 'items']),
  mapStoreDispatch,
  mapWithPropsMemo(({ width, items }) => {
    const colCount = Math.floor((width + COL_SPACE) / (COL_WIDTH + COL_SPACE))
    const itemWidth = ((width - (COL_SPACE * (colCount - 1))) / colCount)
    const top = new Array(colCount).fill(0)
    const cols: TItemWithPosition[][] = new Array(colCount)
      .fill(0)
      .map(() => [])

    items.forEach((item) => {
      let minIndex = 0

      for (let i = 1; i < top.length; ++i) {
        if (top[i] < top[minIndex]) {
          minIndex = i
        }
      }

      const itemHeight = item.width / itemWidth * item.height
      const result: TItemWithPosition = {
        ...item,
        width: itemWidth,
        height: itemHeight,
        top: top[minIndex],
        left: minIndex * (itemWidth + COL_SPACE),
      }

      cols[minIndex].push(result)

      top[minIndex] += itemHeight + COL_SPACE
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

        if (x < firstItem.left || firstItem.left + firstItem.width < x) {
          continue
        }

        const itemIndex = bsc(cols[colIndex], (item: any) => {
          if (y + scrollTop < item.top) {
            return -1
          }

          if (y + scrollTop > item.top + item.height) {
            return 1
          }

          return 0
        })

        if (itemIndex >= 0) {
          const item = cols[colIndex][itemIndex]

          dispatch(actionSelect({
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
  selectedItem,
  diffState,
  onScroll,
  onPress,
}) => (
  <Fragment>
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
            {cols.reduce((result, col, i) => (
              result.concat(
                col.map((item: any, j: number) => {
                  const isVisible = isVisibleItem(item, scrollTop, height)
                  const isNew = prevScrollTop !== null && ((item.top + item.height < prevScrollTop) || (item.top > prevScrollTop + height))

                  if (isVisible && isNew) {
                    return (
                      <Block
                        key={`${i}_${j}`}
                        top={item.top}
                        left={item.left}
                        width={item.width}
                        height={item.height}
                      >
                        <Background color={[0, 0, 0, 1]}/>
                      </Block>
                    )
                  }

                  return isVisible && (
                    <Fragment key={`${i}_${j}`}>
                      {item.type === 'new' && (
                        <ScreenshotNew
                          top={item.top}
                          left={item.left}
                          width={item.width}
                          height={item.height}
                        />
                      )}
                      {item.type === 'diff' && (
                        <ScreenshotDiff
                          top={item.top}
                          left={item.left}
                          oldWidth={item.width}
                          newWidth={item.width}
                          oldHeight={item.height}
                          newHeight={item.height}
                          oldAlpha={alpha}
                          newAlpha={1 - alpha}
                        />
                      )}
                      {item.type === 'deleted' && (
                        <ScreenshotDeleted
                          top={item.top}
                          left={item.left}
                          width={item.width}
                          height={item.height}
                        />
                      )}
                    </Fragment>
                  )
                })
              )
            ), [] as ReactNode[])}
          </Fragment>
        )}
      </Animation>
    </Block>
    {selectedItem && (
      <Popup
        left={0}
        top={0}
        width={width}
        height={height}
      />
    )}
  </Fragment>
))
