import React from 'react'
import { TComponentConfig } from 'autoprops'
import { TParagraph, Paragraph } from '@primitives/paragraph'
import { setupTextAlignTheme, TThemeableTextAligns } from './src'


type Mappings = {
  demo: {},
}

const defaultTheme: TThemeableTextAligns<Mappings> = {
  demo: () => ({
    align: 'start',
    direction: 'left-to-right',
  }),
}

const { TextAlignTheme, createThemeableTextAlign } = setupTextAlignTheme<Mappings>(defaultTheme)

const DemoThemeableTextAlign = createThemeableTextAlign<TParagraph>('demo', Paragraph)

const newTheme: TThemeableTextAligns<Mappings> = {
  demo: () => ({
    align: 'start',
    direction: 'right-to-left',
  }),
}

const text = 'Cat is love, cat is life fall asleep on the washing machine. Gnaw the corn cob. Meow to be let in cat walks in keyboard destroy couch as revenge.'

type TDemoComponent = { hasTheme: boolean }

export const Component = ({ hasTheme }: TDemoComponent) => {
  return (
    hasTheme
      ? (
        <TextAlignTheme.Provider value={newTheme}>
          <DemoThemeableTextAlign>
            { text }
          </DemoThemeableTextAlign>
        </TextAlignTheme.Provider>
      )
      : (
        <DemoThemeableTextAlign>
          { text }
        </DemoThemeableTextAlign>
      )
  )
}

Component.displayName = 'ThemeableTextAlign'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
  },
}

export { default as packageJson } from './package.json'
