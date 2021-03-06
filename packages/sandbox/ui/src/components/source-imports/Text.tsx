import React from 'react'
import type { FC } from 'react'
import type { TColor } from '../../colors'
import { PrimitiveText } from '../primitive-text'

export type TText = {
  color: TColor,
}

export const Text: FC<TText> = ({ color, children }) => (
  <PrimitiveText
    fontFamily="monospace"
    fontSize={14}
    lineHeight={20}
    color={color}
    shouldPreserveWhitespace
  >
    {children}
  </PrimitiveText>
)
