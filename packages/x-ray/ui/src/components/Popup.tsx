import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onMount } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Background } from '@primitives/background'
import { Button } from '@primitives/button'
import { mapStoreDispatch } from '../store'
import { TRect, TType, TGridItem, TSnapshotGridItem, TScreenshotGridItem } from '../types'
import { actionDeselect, actionDiscardItem } from '../actions'
import { COLOR_RED } from '../config'
import { SourceCode } from './SourceCode'
import { Block } from './Block'
import { ScreenshotPreview } from './ScreenshotPreview'
import { SnapshotPreview } from './SnapshotPreview'

const isScreenshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TScreenshotGridItem => type === 'image' && item !== null
const isSnapshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TSnapshotGridItem => type === 'text' && item !== null

const POPUP_OFFSET = 50
const POPUP_SPACING = 20
const BUTTON_HEIGHT = 30

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
    onDiscard: ({ dispatch, item, setState }) => () => {
      dispatch(actionDiscardItem(item.id))
      setState(STATE_CLOSING)
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
      sourceCodeWidth: halfWidth - POPUP_SPACING * 2,
      sourceCodeHeight: popupHeight - BUTTON_HEIGHT - POPUP_SPACING * 2,
      sourceCodeLeft: POPUP_SPACING,
      sourceCodeTop: BUTTON_HEIGHT + POPUP_SPACING,
      previewWidth: halfWidth - POPUP_SPACING * 2,
      previewHeight: popupHeight - BUTTON_HEIGHT - POPUP_SPACING * 2,
      previewLeft: halfWidth + POPUP_SPACING,
      previewTop: BUTTON_HEIGHT + POPUP_SPACING,
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
  sourceCodeLeft,
  sourceCodeTop,
  sourceCodeWidth,
  sourceCodeHeight,
  previewLeft,
  previewTop,
  previewWidth,
  previewHeight,
  shouldNotAnimate,
  onDiscard,
  onBackdropPress,
  onAnimationEnd,
}) => (
  <Block left={left} top={top} width={width} height={height}>
    <Animation
      time={500}
      values={[popupLeft, popupTop, popupWidth, popupHeight, alpha]}
      easing={easeInOutCubic}
      onAnimationEnd={onAnimationEnd}
      shouldNotAnimate={shouldNotAnimate}
    >
      {([popupLeft, popupTop, popupWidth, popupHeight, alpha]) => (
        <Fragment>
          <Block
            left={left}
            top={top}
            width={width}
            height={height}
            style={{
              cursor: 'pointer',
            }}
            onPress={onBackdropPress}
          >
            <Background color={[0, 0, 0, Math.min(alpha, 0.5)]}/>
          </Block>
          <Block
            left={popupLeft}
            top={popupTop}
            width={popupWidth}
            height={popupHeight}
          >
            <Background color={[255, 255, 255, alpha]}/>
            {state === STATE_OPEN && item !== null && (
              <Fragment>
                <Block width={popupWidth} height={BUTTON_HEIGHT} style={{ display: 'flex' }}>
                  <Button onPress={onDiscard}>Discard</Button>
                  <Background color={COLOR_RED}/>
                </Block>
                <SourceCode
                  top={sourceCodeTop}
                  left={sourceCodeLeft}
                  width={sourceCodeWidth}
                  height={sourceCodeHeight}
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
        </Fragment>
      )}
    </Animation>
  </Block>
))

Popup.displayName = 'Popup'
