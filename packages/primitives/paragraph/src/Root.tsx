import React from 'react'
import { normalizeWebStyle, TStyle } from 'stili'
import {
  component,
  mapDefaultProps,
  mapWithProps,
  startWithType,
} from 'refun'
import { colorToString, isColor } from 'colorido'
import { TParagraph } from './types'

export const Paragraph = component(
  startWithType<TParagraph>(),
  mapDefaultProps({
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
    shouldHideOverflow: false,
    isUnderlined: false,
  }),
  mapWithProps(({
    align,
    blockEnd,
    blockStart,
    color,
    direction,
    inlineEnd,
    inlineStart,
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
        fontSmoothing: 'antialiased',
        maxWidth: '100%',
        textRendering: 'geometricPrecision',
        textSizeAdjust: 'none',
      },
      fontFamily,
      fontSize,
      fontWeight,
      minWidth: 0,
      letterSpacing,
      lineHeight,
      paddingBottom: blockEnd,
      paddingLeft: inlineStart,
      paddingRight: inlineEnd,
      paddingTop: blockStart,
    }

    if (isColor(color)) {
      style.color = colorToString(color)
    }

    if (align) {
      switch (align) {
        case 'start': {
          style.textAlign = direction === 'right-to-left' ? 'right' : 'left'

          break
        }

        case 'center': {
          style._webOnly!.textAlign = 'center'

          break
        }

        case 'end': {
          style.textAlign = direction === 'right-to-left' ? 'left' : 'right'

          break
        }
      }
    }

    if (direction) {
      style._webOnly!.direction = direction === 'left-to-right' ? 'ltr' : 'rtl'
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

    if (isUnderlined) {
      style.textDecorationLine = 'underline'
    }

    return {
      style: normalizeWebStyle(style),
    }
  })
)(({ children, style, id }) => (
  <p id={id} style={style}>{children}</p>
))

Paragraph.displayName = 'Paragraph'
