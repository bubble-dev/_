import React from 'react'
import { Background as PrimitiveBackground } from '@primitives/background'
import { startWithType, component } from 'refun'
import { TColor } from 'colorido'
import { AnimationColor } from '../animation-color'
import { SizeParentBlock } from '../size-parent-block'

export type TBackground = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
}

export const Background = component(
  startWithType<TBackground>()
)(({
  topLeftRadius,
  topRightRadius,
  bottomLeftRadius,
  bottomRightRadius,
  color,
}) => (
  <SizeParentBlock>
    <AnimationColor values={color}>
      {(color) => (
        <PrimitiveBackground
          color={color}
          topLeftRadius={topLeftRadius}
          topRightRadius={topRightRadius}
          bottomLeftRadius={bottomLeftRadius}
          bottomRightRadius={bottomRightRadius}
        />
      )}
    </AnimationColor>
  </SizeParentBlock>
))

Background.displayName = 'Background'
Background.componentSymbol = Symbol('BACKGROUND')
