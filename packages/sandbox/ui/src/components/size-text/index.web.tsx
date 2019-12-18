import React from 'react'
import { component, startWithType } from 'refun'
import { Text, TText } from '../text'
import { SYMBOL_SIZE_TEXT } from '../../symbols'
import { SizeContent } from '../size-content'

export type TSizeText = TText & {
  children: string,
}

export const SizeText = component(
  startWithType<TSizeText>()
)(({
  shouldHideOverflow,
  shouldPreventWrap,
  shouldPreventSelection,
  isUnderlined,
  children,
}) => (
  <SizeContent shouldPreventWrap={shouldPreventWrap}>
    <Text
      shouldHideOverflow={shouldHideOverflow}
      shouldPreventWrap={shouldPreventWrap}
      shouldPreventSelection={shouldPreventSelection}
      isUnderlined={isUnderlined}
    >
      {children}
    </Text>
  </SizeContent>
))

SizeText.displayName = 'SizeText'
SizeText.componentSymbol = SYMBOL_SIZE_TEXT
