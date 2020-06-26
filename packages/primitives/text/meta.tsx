import { TComponentConfig } from 'autoprops'
import { TText } from './src'

export const config: TComponentConfig<TText> = {
  props: {
    children: ['Button', 'Long button'],
  },
  required: ['children'],
}

export { Text as Component } from './src'
