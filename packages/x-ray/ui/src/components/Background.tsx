import React, { FC } from 'react'
import { Background as PrimitiveBackground, TBackground as TPrimitiveBackground } from '@primitives/background'
import { TRect } from './types'
import { Block } from './Block'
import { AnimationColor } from './AnimationColor'

export type TBackground = TPrimitiveBackground & TRect

export const Background: FC<TBackground> = ({ top, left, width, height, color, ...props }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
  >
    <AnimationColor values={color}>
      {(color) => (
        <PrimitiveBackground
          color={color}
          {...props}
        />
      )}
    </AnimationColor>
  </Block>
)
