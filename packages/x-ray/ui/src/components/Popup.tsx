import React from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onMount } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { mapStoreDispatch, mapStoreState } from '../store'
import { actionSelect } from '../actions'
import { Block } from './Block'
import { TRect } from './types'
import { Background } from './Background'

const POPUP_OFFSET = 50

const STATE_CLOSE = 0
const STATE_OPENING = 1
const STATE_OPEN = 2
const STATE_CLOSING = 3

export type TPopup = TRect

export const Popup = component(
  startWithType<TPopup>(),
  mapStoreState(({ selectedItem }) => ({
    selectedItem,
  }), ['selectedItem']),
  mapStoreDispatch,
  mapState('state', 'setState', () => STATE_CLOSE, []),
  mapHandlers({
    onBackdropPress: ({ setState }) => () => {
      setState(STATE_CLOSING)
    },
    onClose: ({ dispatch, setState }) => () => {
      setState(STATE_CLOSE)
      dispatch(actionSelect(null))
    },
    onOpen: ({ setState }) => () => {
      setState(STATE_OPEN)
    },
  }),
  mapHandlers({
    onAnimationEnd: ({ state, onOpen, onClose }) => () => {
      state === STATE_OPENING ? onOpen() : onClose()
    },
  }),
  mapWithProps(({ top, left, width, height, state, selectedItem }) => {
    if (selectedItem === null) {
      throw new Error('Invalid selectedItem')
    }

    if (state === STATE_OPENING || state === STATE_OPEN) {
      return {
        popupLeft: left + POPUP_OFFSET,
        popupTop: top + POPUP_OFFSET,
        popupWidth: width - POPUP_OFFSET * 2,
        popupHeight: height - POPUP_OFFSET * 2,
        alpha: 1,
      }
    }

    return {
      popupLeft: selectedItem.left,
      popupTop: selectedItem.top,
      popupWidth: selectedItem.width,
      popupHeight: selectedItem.height,
      alpha: 0,
    }
  }),
  onMount(({ setState }) => {
    setState(STATE_OPENING)
  })
)(({
  left,
  top,
  width,
  height,
  alpha,
  state,
  children,
  popupLeft,
  popupTop,
  popupWidth,
  popupHeight,
  onBackdropPress,
  onAnimationEnd,
}) => (
  <Block left={left} top={top} width={width} height={height}>
    <Block left={left} top={top} width={width} height={height} onPress={onBackdropPress}/>
    <Animation
      time={500}
      values={[popupLeft, popupTop, popupWidth, popupHeight]}
      easing={easeInOutCubic}
      onAnimationEnd={onAnimationEnd}
    >
      {([popupLeft, popupTop, popupWidth, popupHeight]) => (
        <Block
          left={popupLeft}
          top={popupTop}
          width={popupWidth}
          height={popupHeight}
        >
          <Background color={[127, 127, 127, alpha]} animationTime={500}/>
          {state === STATE_OPEN && (
            <Block>
              {children}
            </Block>
          )}
        </Block>
      )}
    </Animation>
  </Block>
))
