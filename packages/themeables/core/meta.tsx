import React, { createContext } from 'react'
import type { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { Background } from '@primitives/background'
import type { TBackground } from '@primitives/background'
import type { TThemeableBackground } from '@themeables/background'
import type { TComponentControls } from '@revert/sandbox'
import { SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import { setupTheme } from './src'
import type { TThemeables, TOverrideables } from './src'

type TDemo = { status: 'default' | 'error' }

const SYMBOL_DEMO = Symbol('Demo')

type Mappings = {
  [SYMBOL_DEMO]: TDemo,
}

const defaultTheme: TThemeables<TThemeableBackground, Mappings> = {
  [SYMBOL_DEMO]: ({ status }) => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
    topLeftRadius: 10,
    topRightRadius: 10,
  }),
}

const OverrideContext: React.Context<TOverrideables<TThemeableBackground, Mappings>> = createContext({})

const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground, Mappings>(defaultTheme, OverrideContext)

export const DemoThemeableBackground = createThemeable<TBackground>(SYMBOL_DEMO, Background)

const newTheme: TThemeables<TThemeableBackground, Mappings> = {
  [SYMBOL_DEMO]: ({ status }) => ({
    color: status === 'default' ? [0x00, 0x00, 0x00, 1] : [0xFF, 0x00, 0x00, 1],
    bottomLeftRadius: 5,
    bottomRightRadius: 5,
    topLeftRadius: 5,
    topRightRadius: 5,
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean, withOverride: boolean}

const overrideTheme: TOverrideables<TThemeableBackground, Mappings> = {
  [SYMBOL_DEMO]: ({ status }) => ({
    color: status === 'error' ? [144, 24, 56, 1] : [108, 105, 86, 1],
  }),
}

export const Component = ({ status, hasTheme, withOverride }: TDemoComponent) => {
  return (
    <OverrideContext.Provider value={withOverride ? overrideTheme : {}}>
      <Block style={{
        width: 100,
        height: 100,
      }}
      >
        {(
      hasTheme
        ? (
          <ThemePiece.Provider value={newTheme}>
            <DemoThemeableBackground status={status}/>
          </ThemePiece.Provider>
        )
        : (
          <DemoThemeableBackground status={status}/>
        )
    )}
      </Block>
    </OverrideContext.Provider>
  )
}

Component.displayName = 'ThemeableBackground'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    withOverride: [true],
    status: ['default', 'error'],
  },
}

// @ts-ignore
export { default as readme } from './readme.md'

export const controls: TComponentControls<TDemoComponent> = {
  hasTheme: SYMBOL_CONTROL_SWITCH,
  withOverride: SYMBOL_CONTROL_SWITCH,
}
