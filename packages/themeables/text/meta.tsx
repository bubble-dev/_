import React from 'react'
import { TComponentConfig } from 'autoprops'
import { setupTextTheme, TThemeableTexts, TThemeableText } from './src'

type Mappings = {
  demo: { status: 'default' | 'error'},
}

const defaultTheme: TThemeableTexts<Mappings> = {
  demo: ({ status }): TThemeableText => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    fontFamily: 'sans-serif',
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 30,
    isUnderlined: false,
  }),
}

const { TextTheme, createThemeableText } = setupTextTheme<Mappings>(defaultTheme)

const DemoThemeableText = createThemeableText('demo')

type TDemo = { status: 'default' | 'error' }

const newTheme: TThemeableTexts<Mappings> = {
  demo: ({ status }): TThemeableText => ({
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

export const Component = ({ status, hasTheme }: TDemoComponent) => {
  return (
    hasTheme ? (
      <TextTheme.Provider value={newTheme}>
        <DemoThemeableText status={status}>
          Label
        </DemoThemeableText>
      </TextTheme.Provider>
    ) : (
      <DemoThemeableText status={status}>
        Label
      </DemoThemeableText>
    )
  )
}

Component.displayName = 'ThemeableText'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}
