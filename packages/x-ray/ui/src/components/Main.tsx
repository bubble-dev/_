import React from 'react'
import { component, startWithType, mapHandlers, mapThrottledHandlerTimeout, mapState, mapWithPropsMemo, mapDebouncedHandlerTimeout } from 'refun'
import { TColor } from 'colorido'
import { Button } from '@primitives/button'
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
  mapState('prevScrollTop', 'setPrevScrollTop', () => null as number | null, []),
  mapState('pressedPos', 'setPressedPos', () => null as [number, number] | null, ['width']),
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
    onPress: ({ setPressedPos, scrollTop }) => (x: number, y: number) => {
      setPressedPos([x, y + scrollTop])
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
)(({ cols, maxHeight, width, height, scrollTop, prevScrollTop, pressedPos, onScroll, onPress }) => (
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
          const isSelected = pressedPos !== null && pressedPos[0] > item.left && pressedPos[0] < item.left + item.width && pressedPos[1] > item.top && pressedPos[1] < item.top + item.height

          return isVisible && (
            <Background
              key={`${i}_${j}`}
              top={item.top}
              left={item.left}
              width={item.width}
              height={item.height}
              color={[isNew ? 255 : 0, isSelected ? 255 : 0, 0, 1]}
            />
          )
        })
      )
    ), [])}
  </Block>
))
