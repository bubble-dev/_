import { TComponentConfig } from 'autoprops'
import * as TextMeta from '@primitives/text/meta'
import { elegir } from 'elegir'
import { TButton } from './src/types'
import packageJson from './package.json'

export const config: TComponentConfig<TButton, 'text'> = {
  props: {
    isDisabled: [true],
    accessibilityLabel: ['button'],
    onPress: [() => {}],
  },
  children: {
    text: TextMeta,
  },
  required: ['text'],
}

export const packageInfo = {
  version: packageJson.version,
  stability: 'stable' as const,
  platform: elegir(
    Reflect.has(packageJson, 'browser') && Reflect.has(packageJson, 'react-native'),
    'Web & Native',
    Reflect.has(packageJson, 'browser'),
    'Web',
    Reflect.has(packageJson, 'react-native'),
    'Native',
    true,
    'Node'
  ),
  designDocsUrl: 'https://google.com',
  sourceCodeUrl: 'https://google.com',
}

export { Button as Component } from './src'
