import React from 'react'
import { component, startWithType, onChange } from 'refun'
import { Root } from './components/root'
import { ThemeProvider } from './components/theme-provider'
import { Sandbox } from './components/sandbox'
import { setComponentsList } from './store-meta'
import { PluginProvider } from './components/plugin-provider'
import { TApp } from './types'

export const App = component(
  startWithType<TApp>(),
  onChange(async ({ components }) => {
    await setComponentsList(components)
  }, ['components'])
)(({ theme, icons, plugin }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider plugin={plugin}>
        <Sandbox/>
      </PluginProvider>
    </ThemeProvider>
  </Root>
))
