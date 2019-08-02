import React, { FC } from 'react'
import { Background, TBackground } from '@primitives/background'
import { TRect } from './types'
import { Block } from './Block'

export type TBorder = TBackground & TRect

export const Border: FC<TBorder> = ({ top, left, width, height, ...props }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
  >
    <Background {...props}/>
  </Block>
)
