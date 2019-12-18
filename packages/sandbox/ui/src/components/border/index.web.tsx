import React from 'react'
import { Border as PrimitiveBorder } from '@primitives/border'
import { TColor } from 'colorido'
import { component, startWithType } from 'refun'
import { AnimationColor } from '../animation-color'
import { SizeParentBlock } from '../size-parent-block'

export type TBorder = {
  color: TColor,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  topWidth?: number,
  rightWidth?: number,
  bottomWidth?: number,
  leftWidth?: number,
  overflow?: number,
}

export const Border = component(
  startWithType<TBorder>()
)(({
  color,
  topLeftRadius,
  topRightRadius,
  bottomRightRadius,
  bottomLeftRadius,
  topWidth,
  rightWidth,
  bottomWidth,
  leftWidth,
  overflow,
}) => (
  <SizeParentBlock>
    <AnimationColor values={color}>
      {(color) => (
        <PrimitiveBorder
          color={color}
          topLeftRadius={topLeftRadius}
          topRightRadius={topRightRadius}
          bottomLeftRadius={bottomLeftRadius}
          bottomRightRadius={bottomRightRadius}
          topWidth={topWidth}
          rightWidth={rightWidth}
          bottomWidth={bottomWidth}
          leftWidth={leftWidth}
          overflowTop={overflow}
          overflowBottom={overflow}
          overflowLeft={overflow}
          overflowRight={overflow}
        />
      )}
    </AnimationColor>
  </SizeParentBlock>
))

Border.displayName = 'Border'
Border.componentSymbol = Symbol('BORDER')
