import { TComponentConfig } from 'autoprops'
import { THeading } from './src'

export const config: TComponentConfig<THeading> = {
  props: {
    children: ['Heading'],
    level: [1, 2, 3, 4, 5, 6],
    align: ['start', 'center', 'end'],
  },
  required: ['children'],
}

export { Heading as Component } from './src'

export { default as packageJson } from './package.json'
