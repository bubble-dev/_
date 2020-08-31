import type { TComponentConfig } from 'autoprops'
import * as TextMeta from '@primitives/text/meta'
import type { TButton } from './src/types'

export const config: TComponentConfig<TButton, 'text'> = {
  props: {
    isDisabled: [true],
    accessibilityLabel: ['button'],
    onPress: [() => {}],
  },
  children: {
    text: TextMeta,
  },
  // required: ['text'],
}

export { Button as Component } from './src'

export { default as packageJson } from './package.json'
