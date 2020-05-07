import { TComponentConfig } from 'autoprops'
import { TParagraph } from './src'

export const config: TComponentConfig<TParagraph> = {
  props: {
    children: ['Paragraph'],
    align: ['start', 'center', 'end'],
  },
  required: ['children'],
}

export { Paragraph as Component } from './src'

export { default as packageJson } from './package.json'
