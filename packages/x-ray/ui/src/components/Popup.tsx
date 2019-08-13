import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onMount } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Background } from '@primitives/background'
import { mapStoreDispatch, mapStoreState } from '../store'
import { actionSelect } from '../actions'
import { TRect } from '../types'
import { Block } from './Block'
import { Props } from './Props'
import { Preview } from './Preview'
import { Shadow } from './Shadow'

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
      switch (state) {
        case STATE_CLOSING: {
          onClose()

          break
        }
        case STATE_OPENING: {
          onOpen()

          break
        }
      }
    },
  }),
  mapWithProps(({ top, left, width, height, state, selectedItem }) => {
    if (selectedItem === null) {
      throw new Error('Invalid selectedItem')
    }

    const shouldNotAnimate = state === STATE_OPEN || state === STATE_CLOSE

    if (state === STATE_OPENING || state === STATE_OPEN) {
      return {
        popupLeft: left + POPUP_OFFSET,
        popupTop: top + POPUP_OFFSET,
        popupWidth: width - POPUP_OFFSET * 2,
        popupHeight: height - POPUP_OFFSET * 2,
        alpha: 1,
        shouldNotAnimate,
      }
    }

    return {
      popupLeft: selectedItem.left,
      popupTop: selectedItem.top,
      popupWidth: selectedItem.gridWidth,
      popupHeight: selectedItem.gridHeight,
      alpha: 0,
      shouldNotAnimate,
    }
  }),
  onMount(({ setState }) => {
    setState(STATE_OPENING)
  }),
  mapWithProps(({ popupWidth, popupHeight }) => {
    const halfWidth = popupWidth / 2

    return ({
      propsWidth: halfWidth,
      propsHeight: popupHeight,
      propsLeft: 0,
      propsTop: 0,
      previewWidth: halfWidth,
      previewHeight: popupHeight,
      previewLeft: halfWidth,
      previewTop: 0,
    })
  })
)(({
  left,
  top,
  width,
  height,
  alpha,
  state,
  popupLeft,
  popupTop,
  popupWidth,
  popupHeight,
  propsLeft,
  propsTop,
  propsWidth,
  propsHeight,
  previewLeft,
  previewTop,
  previewWidth,
  previewHeight,
  shouldNotAnimate,
  onBackdropPress,
  onAnimationEnd,
}) => (
  <Block left={left} top={top} width={width} height={height}>
    <Block left={left} top={top} width={width} height={height} onPress={onBackdropPress}/>
    <Animation
      time={500}
      values={[popupLeft, popupTop, popupWidth, popupHeight, alpha]}
      easing={easeInOutCubic}
      onAnimationEnd={onAnimationEnd}
      shouldNotAnimate={shouldNotAnimate}
    >
      {([popupLeft, popupTop, popupWidth, popupHeight, alpha]) => (
        <Block
          left={popupLeft}
          top={popupTop}
          width={popupWidth}
          height={popupHeight}
        >
          <Background color={[255, 255, 255, alpha]}/>
          {state === STATE_OPEN && (
            <Fragment>
              <Shadow color={[0, 0, 0, alpha]} blurRadius={20} spreadRadius={1}/>
              <Props
                top={propsTop}
                left={propsLeft}
                width={propsWidth}
                height={propsHeight}
              />
              <Preview
                top={previewTop}
                left={previewLeft}
                width={previewWidth}
                height={previewHeight}
              />
            </Fragment>
          )}
        </Block>
      )}
    </Animation>
  </Block>
))
