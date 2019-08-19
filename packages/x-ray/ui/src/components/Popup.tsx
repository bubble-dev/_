import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onMount } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Background } from '@primitives/background'
import { mapStoreDispatch } from '../store'
import { TRect, TType, TGridItem, TSnapshotGridItem, TScreenshotGridItem } from '../types'
import { actionDeselect } from '../actions'
import { SourceCode } from './SourceCode'
import { Block } from './Block'
import { ScreenshotPreview } from './ScreenshotPreview'
import { Shadow } from './Shadow'
import { Border } from './Border'
import { SnapshotPreview } from './SnapshotPreview'

const isScreenshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TScreenshotGridItem => type === 'image' && item !== null
const isSnapshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TSnapshotGridItem => type === 'text' && item !== null

const POPUP_OFFSET = 50

const STATE_CLOSE = 0
const STATE_OPENING = 1
const STATE_OPEN = 2
const STATE_CLOSING = 3

export type TPopup = TRect & {
  type: TType,
  item: TGridItem,
}

export const Popup = component(
  startWithType<TPopup>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => STATE_CLOSE, []),
  mapHandlers({
    onBackdropPress: ({ setState }) => () => {
      setState(STATE_CLOSING)
    },
    onClose: ({ dispatch, setState }) => () => {
      setState(STATE_CLOSE)
      dispatch(actionDeselect())
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
  mapWithProps(({ top, left, width, height, state, item }) => {
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
      popupLeft: item.left,
      popupTop: item.top,
      popupWidth: item.gridWidth,
      popupHeight: item.gridHeight,
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
  item,
  type,
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
          <Border
            color={[0, 0, 0, alpha]}
            leftWidth={2}
            topWidth={2}
            rightWidth={2}
            bottomWidth={2}
            overflowLeft={2}
            overflowTop={2}
            overflowRight={2}
            overflowBottom={2}
          />
          <Background color={[255, 255, 255, alpha]}/>
          {state === STATE_OPEN && item !== null && (
            <Fragment>
              <Shadow color={[0, 0, 0, alpha]} blurRadius={20}/>
              <SourceCode
                top={propsTop}
                left={propsLeft}
                width={propsWidth}
                height={propsHeight}
                item={item}
              />
              {isScreenshotGridItem(type, item) && (
                <ScreenshotPreview
                  top={previewTop}
                  left={previewLeft}
                  width={previewWidth}
                  height={previewHeight}
                  item={item}
                />
              )}
              {isSnapshotGridItem(type, item) && (
                <SnapshotPreview
                  top={previewTop}
                  left={previewLeft}
                  width={previewWidth}
                  height={previewHeight}
                  item={item}
                />
              )}
            </Fragment>
          )}
        </Block>
      )}
    </Animation>
  </Block>
))

Popup.displayName = 'Popup'
