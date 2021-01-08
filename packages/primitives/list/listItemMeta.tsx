import type { TComponentConfig } from 'autoprops'
import type { TListItem } from './src/types'

export const config: TComponentConfig<TListItem> = {
  props: {
    id: ['listItem'],
    children: ['I am a listItem'],
  },
}

export { ListItem as Component } from './src'

export { default as packageJson } from './package.json'
