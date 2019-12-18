import { ReactNode, CSSProperties } from 'react'

export type TBlockCommon = {
  width?: number,
  height?: number,
  maxWidth?: number,
  maxHeight?: number,
  minWidth?: number,
  minHeight?: number,
  top?: number,
  left?: number,
  right?: number,
  bottom?: number,
  opacity?: number,
  floatingIndex?: number,
  tabIndex?: number,
  shouldIgnorePointerEvents?: boolean,
  shouldFlow?: boolean,
  shouldScroll?: boolean,
  shouldHideOverflow?: boolean,
  shouldForceAcceleration?: boolean,
  blendMode?: CSSProperties['mixBlendMode'],
  children?: ReactNode,
}
