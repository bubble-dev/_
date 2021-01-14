import type { TComponentConfig } from 'autoprops'
import * as List_ItemsMeta from './listItemMeta'
import type { TList } from './src'

export const config: TComponentConfig<TList, 'items'> = {
  props: {
    id: ['list'],
    type: ['orderedList', 'unorderedList'],
  },
  children: {
    items: List_ItemsMeta,
  },
  required: ['items'],
}

export { List as Component } from './src'
export { default as packageJson } from './package.json'
