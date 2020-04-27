import React from 'react'
import { normalizeWebStyle, TStyle } from 'stili'
import {
  component,
  mapDefaultProps,
  mapWithProps,
  startWithType,
} from 'refun'
import { isNumber } from 'tsfn'
import { isColor, colorToString } from '../../colors'
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
    shouldPreserveWhitespace,
    shouldPreventSelection,
    shouldPreventWrap,
    shouldHideOverflow,
  }) => {
    const style: TStyle = {
      _webOnly: {
        maxWidth: '100%',
        fontSmoothing: 'antialiased',
        textRendering: 'geometricPrecision',
        textSizeAdjust: 'none',
      },
      fontFamily,
      fontWeight,
      fontSize,
      minWidth: 0,
    }

    if (isColor(color)) {
      style.color = colorToString(color)
    }

    if (shouldPreserveWhitespace) {
      style._webOnly!.whiteSpace = 'pre'
      style.flexShrink = 0
    }

    if (shouldPreventWrap) {
      style._webOnly!.whiteSpace = 'nowrap'
      style.flexShrink = 0
    }

    if (shouldPreventSelection) {
      style._webOnly!.userSelect = 'none'
    }

    if (shouldHideOverflow) {
      style._webOnly!.whiteSpace = 'nowrap'
      style._webOnly!.textOverflow = 'ellipsis'
      style.overflow = 'hidden'
      style.flexShrink = 0
    }

    if (isNumber(letterSpacing)) {
      style.letterSpacing = letterSpacing
    }

    if (isNumber(lineHeight)) {
      style.lineHeight = lineHeight
    }

    if (isUnderlined) {
      style._webOnly!.textDecorationLine = 'underline'
    }

    return {
      style: normalizeWebStyle(style),
    }
  })
)(({ children, style, id }) => (
  <span id={id} style={style}>{children}</span>
))

PrimitiveText.displayName = 'PrimitiveText'
