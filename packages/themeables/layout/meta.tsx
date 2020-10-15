import React from 'react'
import type { TComponentConfig } from 'autoprops'
import { Layout } from '@primitives/layout'
import type { TLayout } from '@primitives/layout'
import { Block } from '@primitives/block'
import type { TComponentControls } from '@revert/sandbox'
import { SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import { setupLayoutTheme } from './src'
import type { TThemeableLayouts } from './src'

type TDemo = {}

type Mappings = {
  demo: TDemo,
}

const defaultTheme: TThemeableLayouts<Mappings> = {
  demo: () => ({
    width: 100,
    height: 100,
  }),
}

const { LayoutTheme, createThemeableLayout } = setupLayoutTheme<Mappings>(defaultTheme)

const DemoThemeableLayout = createThemeableLayout<TLayout>('demo', Layout)

const newTheme: TThemeableLayouts<Mappings> = {
  demo: () => ({
    width: 70,
    height: 70,
  }),
}

const DemoBackground = () => (
  <Block style={{ width: '100%', height: '100%', backgroundColor: 'gray' }}/>
)

type TDemoComponent = TDemo & { hasTheme: boolean }

export const Component = ({ hasTheme }: TDemoComponent) => {
  return (
    hasTheme
      ? (
        <LayoutTheme.Provider value={newTheme}>
          <DemoThemeableLayout>
            <DemoBackground/>
          </DemoThemeableLayout>
        </LayoutTheme.Provider>
      )
      : (
        <DemoThemeableLayout>
          <DemoBackground/>
        </DemoThemeableLayout>
      )
  )
}

Component.displayName = 'ThemeableLayout'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
  },
}

export { default as packageJson } from './package.json'

// @ts-ignore
export { default as readme } from './readme.md'

export const controls: TComponentControls<TDemoComponent> = {
  hasTheme: SYMBOL_CONTROL_SWITCH,
}
