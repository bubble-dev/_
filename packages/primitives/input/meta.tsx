import { TComponentConfig } from 'autoprops'
import { elegir } from 'elegir'
import { TInput } from './src/types'
import packageJson from './package.json'

export const config: TComponentConfig<TInput> = {
  props: {
    isDisabled: [true],
    color: [[0xff, 0x00, 0x00, 1]],
    fontSize: [24],
    fontFamily: ['Arial'],
    fontWeight: [700],
    lineHeight: [24],
    letterSpacing: [5],
    paddingLeft: [10],
    paddingTop: [10],
    paddingRight: [10],
    paddingBottom: [10],
    value: ['value'],
    onChange: [() => {}],
  },
  required: ['value', 'onChange'],
  mutin: [
    ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'],
  ],
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

export { Input as Component } from './src'
