import { forwardRef, ForwardRefExoticComponent } from 'react'
import { Block, TBlock } from './Block'

export type TBlockRef = TBlock

export const BlockRef: ForwardRefExoticComponent<TBlockRef> = forwardRef<HTMLDivElement>((props, ref) => (
  Block({ ...props, ref })
))
