import React from 'react'
import type { TComponentConfig } from 'autoprops'
import { Text } from '@primitives/text'
import type { TBlock } from './src'

export const config: TComponentConfig<TBlock, 'items'> = {
  props: {
    style: [{ minWidth: 100, minHeight: 40, backgroundColor: '#ffb3c7' }],
    role: ['main', 'header', 'footer', 'navigation', 'section', 'secondary', 'primary', 'none'],
    children: [<Text key="first">Me... a Block</Text>],
  },
  required: ['style', 'children'],
}

export { Block as Component } from './src'
export { default as packageJson } from './package.json'
