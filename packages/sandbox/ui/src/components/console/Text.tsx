import React from 'react'
import { Text as PrimitiveText } from '@primitives/text'
import { component, startWithType, mapContext } from 'refun'
import { TextThemeContext } from '../theme-provider'

export type TText = {
  children: string,
}

export const Text = component(
  startWithType<TText>(),
  mapContext(TextThemeContext)
)(({ color, children }) => (
  <PrimitiveText
    fontFamily="monospace"
    fontSize={14}
    lineHeight={20}
    color={color}
    shouldPreserveWhitespace
  >
    {children}
  </PrimitiveText>
))
