import React from 'react'
import { Text } from '@primitives/text'
import type { TComponentConfig } from 'autoprops'
import type { TListItem } from './src/types'

export const config: TComponentConfig<TListItem> = {
  props: {
    id: ['listItem'],
    children: [<Text key="first">I am a listItem</Text>],
  },
}

export { ListItem as Component } from './src'

export { default as packageJson } from './package.json'
