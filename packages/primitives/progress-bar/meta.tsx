import React from 'react'
import type { TComponentConfig } from 'autoprops'
import { Text } from '@primitives/text'
import type { TProgressBar } from './src'

export const config: TComponentConfig<TProgressBar, 'items'> = {
  props: {
    style: [{ minWidth: 100, minHeight: 40, backgroundColor: '#ffb3c7' }],
    children: [<Text key="first">Me... a ProgressBar</Text>],
    ariaValuemin: [0, 15],
    ariaValuenow: [80, 47],
    ariaValuemax: [100, 150],
  },
  required: ['style', 'children'],
}

export { ProgressBar as Component } from './src'
export { default as packageJson } from './package.json'
