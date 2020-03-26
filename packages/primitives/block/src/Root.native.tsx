import React from 'react'
import { View, ViewProps } from 'react-native'
import { TStyle, normalizeStyle } from 'stili'
import { startWithType, component, mapDefaultProps, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import { TBlockCommon } from './types'

export type TBlock = TBlockCommon<View, TStyle>

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    shouldStretch: false,
    shouldIgnorePointerEvents: false,
    shouldScroll: false,
    shouldHideOverflow: false,
    minWidth: 0,
    minHeight: 0,
  }),
  mapProps(
    ({
      id,
      style,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      top,
      right,
      bottom,
      left,
      isFloating,
      floatingIndex,
      opacity,
      children,
      shouldStretch,
      shouldScroll,
      shouldHideOverflow,
      shouldIgnorePointerEvents,
      ref,
      role,
    }) => {
      const styles: TStyle = {
        borderStyle: 'solid',
        borderWidth: 0,
        position: 'relative',
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
        alignSelf: 'flex-start',
        minWidth,
        minHeight,
        ...style,
      }

      if (isNumber(width)) {
        styles.width = width
        styles.flexGrow = 0
        styles.flexShrink = 0
      }

      if (isNumber(height)) {
        styles.height = height
        styles.alignSelf = 'flex-start'
      }

      if (isNumber(maxWidth)) {
        styles.maxWidth = maxWidth
      }

      if (isNumber(maxHeight)) {
        styles.maxHeight = maxHeight
      }

      if (isNumber(top)) {
        styles.top = top
      }

      if (isNumber(right)) {
        styles.right = right
      }

      if (isNumber(bottom)) {
        styles.bottom = bottom
      }

      if (isNumber(left)) {
        styles.left = left
      }

      if (shouldStretch) {
        styles.flexGrow = 1
        styles.flexShrink = 1
        styles.alignSelf = 'stretch'
      }

      if (isFloating) {
        styles.position = 'absolute'
      }

      if (isFloating && isNumber(floatingIndex)) {
        styles.zIndex = floatingIndex
      }

      if (isNumber(opacity)) {
        styles.opacity = opacity
      }

      if (shouldScroll) {
        styles.overflow = 'scroll'
      }

      if (shouldHideOverflow) {
        styles.overflow = 'hidden'
      }

      const props: ViewProps = {}

      if (shouldIgnorePointerEvents) {
        props.pointerEvents = 'none'
      }

      if (typeof id === 'string') {
        props.testID = id
      }

      return {
        ...props,
        style: normalizeStyle(styles),
        children,
        ref,
        role,
      }
    }
  )
)(({ role, ...props }) => {
  switch (role) {
    case 'navigation':
      return <View accessibilityRole="menu" {...props}/>

    case 'header':
      return <View accessibilityRole="header" {...props}/>

    default:
      return <View {...props}/>
  }
})

Block.displayName = 'Block'
