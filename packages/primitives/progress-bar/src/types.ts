import type { ReactNode } from 'react'
import type { TStyle } from 'stili'

export type TProgressBar = {
  id?: string,
  ariaValuemin?: number,
  ariaValuenow?: number,
  ariaValuemax?: number,
  children?: ReactNode,
  style?: TStyle,
}
