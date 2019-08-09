import React from 'react'
import { component, startWithType, mapHandlers, mapThrottledHandlerTimeout, mapState, mapWithPropsMemo, mapDebouncedHandlerTimeout } from 'refun'
import { TColor } from 'colorido'
import bsc from 'bsc'
import { mapStoreState, mapStoreDispatch } from '../store'
import { actionSelect } from '../actions'
import { TSize } from './types'
import { Background } from './Background'
import { Block } from './Block'

const COL_WIDTH = 100
const COL_SPACE = 20
const BORDER_SIZE = 2
const BORDER_COLOR = [0, 0, 0, 1] as TColor

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapStoreDispatch,
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
  mapState('prevScrollTop', 'setPrevScrollTop', () => null as number | null, []),
  mapHandlers(({
    onScroll1: ({ setScrollTop, setPrevScrollTop, prevScrollTop }) => (scrollTop) => {
      setScrollTop(scrollTop)

      if (prevScrollTop === null) {
        setPrevScrollTop(scrollTop)
      }
    },
    onScroll2: ({ setPrevScrollTop }) => () => {
      setPrevScrollTop(null)
    },
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
          dispatch(actionSelect(cols[colIndex][itemIndex]))
        }
      }
    },
  })),
  mapThrottledHandlerTimeout('onScroll1', 50),
  mapDebouncedHandlerTimeout('onScroll2', 100),
  mapHandlers({
    onScroll: ({ onScroll1, onScroll2 }) => (scrollTop) => {
      onScroll1(scrollTop)
      onScroll2()
    },
  })
)(({ cols, maxHeight, width, height, scrollTop, prevScrollTop, onScroll, onPress }) => (
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
    {cols.reduce((result, col, i) => (
      result.concat(
        col.map((item: any, j: number) => {
          const isVisible = (item.top + item.height > scrollTop - 100) && (item.top < scrollTop + height + 100)
          const isNew = prevScrollTop !== null && ((item.top + item.height < prevScrollTop) || (item.top > prevScrollTop + height))

          return isVisible && (
            <Background
              key={`${i}_${j}`}
              top={item.top}
              left={item.left}
              width={item.width}
              height={item.height}
              color={[isNew ? 255 : 0, 0, 0, 1]}
            />
          )
        })
      )
    ), [])}
  </Block>
))
