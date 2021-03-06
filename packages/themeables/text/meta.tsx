import React from 'react'
import type { TComponentConfig } from 'autoprops'
import { Text } from '@primitives/text'
import type { TText } from '@primitives/text'
import { Input } from '@primitives/input'
import type { TInput } from '@primitives/input'
import type { TComponentControls } from '@revert/sandbox'
import { SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import { setupTextTheme } from './src'
import type { TThemeableTexts, TThemeableText } from './src'

type Mappings = {
  DemoText: { status: 'default' | 'error' },
  DemoInput: { status: 'default' | 'error' },
}

const defaultTheme: TThemeableTexts<Mappings> = {
  DemoText: ({ status }): TThemeableText => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    fontFamily: 'sans-serif',
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 30,
    isUnderlined: false,
  }),
  DemoInput: ({ status }): TThemeableText => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    fontFamily: 'sans-serif',
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 30,
    isUnderlined: false,
  }),
}

const { TextTheme, createThemeableText } = setupTextTheme()

const DemoThemeableText = createThemeableText<TText, Mappings>('DemoText', Text)
const DemoThemeableInput = createThemeableText<TInput, Mappings>('DemoInput', Input)

type TDemo = { status: 'default' | 'error' }

const newTheme: TThemeableTexts<Mappings> = {
  DemoText: ({ status }): TThemeableText => ({
    color: status === 'default' ? [0x00, 0x00, 0x00, 1] : [0xFF, 0x99, 0x99, 1],
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 20,
    isUnderlined: true,
  }),
  DemoInput: ({ status }): TThemeableText => ({
    color: status === 'default' ? [0x00, 0x00, 0x00, 1] : [0xFF, 0x99, 0x99, 1],
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 20,
    isUnderlined: true,
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean}

export const Component = ({ status, hasTheme }: TDemoComponent) => (
  <TextTheme.Provider value={hasTheme ? newTheme : defaultTheme}>
    <DemoThemeableText status={status}>
      Label
    </DemoThemeableText>
    <DemoThemeableInput status={status} value="Label"/>
  </TextTheme.Provider>
)

Component.displayName = 'ThemeableText'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}

// @ts-ignore
export { default as readme } from './readme.md'

export const controls: TComponentControls<TDemoComponent> = {
  hasTheme: SYMBOL_CONTROL_SWITCH,
}
