import React from 'react'
import {
  component,
  mapWithProps,
  startWithType,
  mapDefaultProps,
} from 'refun'
import {
  Text as NativeText,
  TextProps,
  View as NativeView,
  ViewProps,
} from 'react-native'
import { TStyle, normalizeNativeStyle } from 'stili'
import { colorToString, isColor } from 'colorido'
import { THeading } from './types'

export const Heading = component(
  startWithType<THeading>(),
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
    shouldPreventSelection,
    shouldPreventWrap,
    shouldHideOverflow,
  }) => {
    const textStyle: TStyle = {
      backgroundColor: 'transparent',
      lineHeight,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      _nativeOnly: {},
    }

    const viewStyle: TStyle = {
      paddingBottom: blockEnd,
      paddingLeft: inlineStart,
      paddingRight: inlineEnd,
      paddingTop: blockStart,
    }

    if (isColor(color)) {
      textStyle.color = colorToString(color)
    }

    if (align) {
      switch (align) {
        case 'start': {
          textStyle.textAlign = direction === 'right-to-left' ? 'right' : 'left'

          break
        }

        case 'center': {
          textStyle.textAlign = 'center'

          break
        }

        case 'end': {
          textStyle.textAlign = direction === 'right-to-left' ? 'left' : 'right'

          break
        }
      }
    }

    if (direction) {
      textStyle._nativeOnly!.writingDirection = direction === 'right-to-left' ? 'rtl' : 'ltr'
    }

    if (isUnderlined) {
      textStyle.textDecorationLine = 'underline'
    }

    const props: { text: TextProps, view: ViewProps } = {
      view: {
        style: normalizeNativeStyle(viewStyle),
      },
      text: {
        style: normalizeNativeStyle(textStyle),
        selectable: !shouldPreventSelection,
      },
    }

    if (shouldPreventWrap) {
      props.text.numberOfLines = 1
    }

    if (shouldHideOverflow) {
      props.text.numberOfLines = 1
      props.text.ellipsizeMode = 'tail'
    }

    return props
  })
)(({
  children,
  id,
  text: { ellipsizeMode, numberOfLines, selectable, style: textStyle },
  view: { style: viewStyle },
}) => (
  <NativeView style={viewStyle}>
    <NativeText
      accessibilityRole="header"
      testID={id}
      selectable={selectable}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={textStyle}
    >
      {children}
    </NativeText>
  </NativeView>
))

Heading.displayName = 'Heading'
