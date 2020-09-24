import React, { createContext } from 'react'
import type { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { Background } from '@primitives/background'
import type { TBackground } from '@primitives/background'
import { createThemeableBackground } from './src'
import type { TThemeableBackgrounds, TThemeableBackground } from './src'
import type { TThemeables } from '@themeables/core2'

type TDemo = { status: 'default' | 'error' }

type Mappings = {
  demo: TDemo,
}

const ThemeContext: React.Context<TThemeables<TThemeableBackground, Mappings>> = createContext({})

export const DemoThemeableBackground = createThemeableBackground<TBackground, Mappings>('demo', Background, ThemeContext)

const defaultTheme: TThemeableBackgrounds<Mappings> = {
  demo: ({ status }) => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
    topLeftRadius: 10,
    topRightRadius: 10,
  }),
}

const newTheme: TThemeableBackgrounds<Mappings> = {
  demo: ({ status }) => ({
    color: status === 'default' ? [0x00, 0x00, 0x00, 1] : [0xFF, 0x00, 0x00, 1],
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
    topLeftRadius: 10,
    topRightRadius: 10,
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean }

export const Component = ({ status, hasTheme }: TDemoComponent) => (
  <Block
    style={{
      width: 100,
      height: 100,
    }}
  >
    <ThemeContext.Provider value={hasTheme ? newTheme : defaultTheme}>
      <DemoThemeableBackground status={status}/>
    </ThemeContext.Provider>
  </Block>
)

Component.displayName = 'ThemeableBackground'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}
