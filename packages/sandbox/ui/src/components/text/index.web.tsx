import React from 'react'
import { Text as PrimitiveText } from '@primitives/text'
import { component, startWithType, mapContext } from 'refun'
import { AnimationColor } from '../animation-color'
import { TextThemeContext } from '../theme-provider'

export type TText = {
  shouldPreventWrap?: boolean,
  shouldHideOverflow?: boolean,
  shouldPreventSelection?: boolean,
  isUnderlined?: boolean,
}

export const Text = component(
  startWithType<TText>(),
  mapContext(TextThemeContext)
)(({
  color,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  children,
  shouldPreventWrap,
  shouldHideOverflow,
  shouldPreventSelection,
  isUnderlined,
}) => (
  <AnimationColor values={color}>
    {(color) => (
      <PrimitiveText
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        fontSize={fontSize}
        lineHeight={lineHeight}
        color={color}
        shouldPreventWrap={shouldPreventWrap}
        shouldHideOverflow={shouldHideOverflow}
        shouldPreventSelection={shouldPreventSelection}
        isUnderlined={isUnderlined}
      >
        {children}
      </PrimitiveText>
    )}
  </AnimationColor>
))

Text.displayName = 'Text'
Text.componentSymbol = Symbol('SYMBOL_TEXT')
