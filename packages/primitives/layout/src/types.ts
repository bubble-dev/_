import { ReactNode } from 'react'

export type TLayoutDirection = 'horizontal' | 'vertical'

export type TContextData = {
  direction: TLayoutDirection,
}

export type TVAlign = 'top' | 'center' | 'bottom'
export type THAlign = 'left' | 'center' | 'right'

export type TLayoutProps = {
  width?: number,
  height?: number,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number,
  direction: TLayoutDirection,
  vAlign?: TVAlign,
  hAlign?: THAlign,
  children: ReactNode,
}

export type TLayoutItemProps = {
  width?: number | 'stretch',
  height?: number | 'stretch',
  vAlign?: TVAlign,
  hAlign?: THAlign,
  children?: ReactNode,
  shouldScroll?: boolean,
}

export type TLayoutSpacerProps = {
  size?: number,
}
