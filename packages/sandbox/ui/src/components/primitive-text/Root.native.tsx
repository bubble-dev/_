import React from 'react'
import {
  component,
  mapWithProps,
  startWithType,
  mapDefaultProps,
} from 'refun'
import { Text as NativeText, TextProps, TextStyle } from 'react-native'
import { isNumber } from 'tsfn'
import { colorToString, isColor } from '../../colors'
import { TPrimitiveText } from './types'

export const PrimitiveText = component(
  startWithType<TPrimitiveText>(),
  mapDefaultProps({
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
    shouldHideOverflow: false,
    isUnderlined: false,
  }),
  mapWithProps(({
    color,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    isUnderlined,
    shouldPreventSelection,
    shouldPreventWrap,
    shouldHideOverflow,
  }) => {
    const style: TextStyle = {
      backgroundColor: 'transparent',
      lineHeight,
      fontFamily,
      fontSize,
      letterSpacing,
    }

    if (isNumber(fontWeight)) {
      style.fontWeight = String(fontWeight) as TextStyle['fontWeight']
    }

    if (isColor(color)) {
      style.color = colorToString(color)
    }

    if (isUnderlined) {
      style.textDecorationLine = 'underline'
    }

    const props: TextProps = {
      style,
      selectable: !shouldPreventSelection,
    }

    if (shouldPreventWrap) {
      props.numberOfLines = 1
    }

    if (shouldHideOverflow) {
      props.numberOfLines = 1
      props.ellipsizeMode = 'tail'
    }

    return props
  })
)(({ id, children, style, numberOfLines, ellipsizeMode, selectable }) => (
  <NativeText
    testID={id}
    selectable={selectable}
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}
    style={style}
  >
    {children}
  </NativeText>
))

PrimitiveText.displayName = 'Text'
