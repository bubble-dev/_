import React from 'react'
import { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { TParagraph, Paragraph } from './src'

export const config: TComponentConfig<TParagraph> = {
  props: {
    children: ['Paragraph', 'בוקר טוב'],
    align: ['start', 'center', 'end'],
    direction: ['right-to-left', 'left-to-right'],
  },
  required: ['children'],
}

export const Component = (props: TParagraph) => (
  <Block width={300} style={{ flexDirection: 'column' }}>
    <Paragraph {...props}/>
  </Block>
)

export { default as packageJson } from './package.json'
