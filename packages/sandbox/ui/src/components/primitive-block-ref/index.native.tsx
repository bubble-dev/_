import { forwardRef, ForwardRefExoticComponent } from 'react'
import { View } from 'react-native'
import { PrimitiveBlock, TPrimitiveBlock } from '../primitive-block/index.native'

export const PrimitiveBlockRef: ForwardRefExoticComponent<TPrimitiveBlock> = forwardRef<View>((props, ref) => (
  PrimitiveBlock({ ...props, ref })
))

PrimitiveBlockRef.displayName = 'PrimitiveBlockRef'
