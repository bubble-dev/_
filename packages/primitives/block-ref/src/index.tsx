import { forwardRef, ForwardRefExoticComponent } from 'react'
import { Block, TBlock } from '@primitives/block'

export type TBlockRef = TBlock

export const BlockRef: ForwardRefExoticComponent<TBlockRef> = forwardRef((props, ref) => (
  Block({ ...props, ref })
))

BlockRef.displayName = 'BlockRef'
