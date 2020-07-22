import { ReactNode } from 'react'
import { TThemeableText } from '@themeables/text'
import { TThemeableSpacer } from '@themeables/spacer'

export type TAlign = 'start' | 'center' | 'end'
export type TDirection = 'left-to-right' | 'right-to-left'

export type TParagraph = {
  align?: TAlign,
  direction?: TDirection,
  id?: string,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
  children: ReactNode,
} & TThemeableText
  & TThemeableSpacer
