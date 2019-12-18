import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { colorToString } from 'colorido'
import { Surface, Shape } from '@primitives/svg'
import { Block } from '@primitives/block'
import { AnimationColor } from '../animation-color'
import { SYMBOL_ICON } from '../../symbols'
import { TextThemeContext } from '../theme-provider'

export const iconSize = 12

export type TIconSmall = {
  d: string,
}

export const IconSmall = component(
  startWithType<TIconSmall>(),
  mapContext(TextThemeContext)
)(({ d, color }) => (
  <Block width={iconSize} height={iconSize} shouldIgnorePointerEvents>
    <Surface height={iconSize} width={iconSize}>
      <AnimationColor values={color}>
        {(color) => (
          <Shape
            d={d}
            fill={colorToString(color)}
          />
        )}
      </AnimationColor>
    </Surface>
  </Block>
))

IconSmall.displayName = 'IconSmall'
IconSmall.componentSymbol = SYMBOL_ICON
