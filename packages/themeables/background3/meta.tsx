import React, { createContext } from 'react'
import type { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { Background } from '@primitives/background'
import type { TBackground } from '@primitives/background'
import { setupBackgroundTheme } from './src'
import type { TThemeableBackgrounds, TThemeableBackground } from './src'
import { TThemeables } from '@themeables/core3'

type TDemo = { status: 'default' | 'error' }

type Mappings = {
  demo: TDemo,
}

const OverrideContext: React.Context<TThemeables<TThemeableBackground, Mappings>> = createContext({})
const { BackgroundTheme, createThemeableBackground } = setupBackgroundTheme(OverrideContext)
export const DemoThemeableBackground = createThemeableBackground<TBackground, TThemeableBackground, Mappings>('demo', Background)

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

const overrideTheme: TThemeables<TThemeableBackground, Mappings> = {
  demo: ({ status }) => ({
    color: status === 'error' ? [144, 24, 56, 1] : [108, 105, 86, 1],
  }),
}

type TDemoComponent = {
  hasTheme: boolean,
  withOverride: boolean
} & TDemo

export const Component = ({ status, hasTheme, withOverride }: TDemoComponent) => (
  <OverrideContext.Provider value={withOverride ? overrideTheme : {}}>
    <Block
      style={{
        width: 100,
        height: 100,
      }}
    >
      <BackgroundTheme.Provider value={hasTheme ? newTheme : defaultTheme}>
        <DemoThemeableBackground status={status}/>
      </BackgroundTheme.Provider>
    </Block>
  </OverrideContext.Provider>
)

Component.displayName = 'ThemeableBackground'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    withOverride: [true],
    status: ['default', 'error'],
  },
}
