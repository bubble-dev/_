import React from 'react'
import { component, startWithType, onChange } from 'refun'
import { Root } from './components/root'
import { ThemeProvider } from './components/theme-provider'
import { Sandbox } from './components/sandbox'
import { NotificationProvider } from './components/notification-provider'
import { AlertProvider } from './components/alert-provider'
import { PortalProvider } from './components/portal-provider'
import { setComponentsList } from './store-meta'
import { TComponents, TTheme, TThemeIcons } from './types'
import { PluginProvider, TPlugin } from './components/plugin-provider'
import { ImportPackageNameProvider } from './components/import-package-name-provider'

export type TApp = {
  components: TComponents,
  theme?: TTheme,
  icons?: TThemeIcons,
  getImportPackageName?: (symbolName: string) => string,
  plugin?: TPlugin,
}

export const App = component(
  startWithType<TApp>(),
  onChange(async ({ components }) => {
    await setComponentsList(components)
  }, ['components'])
)(({ theme, icons, getImportPackageName, plugin }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider plugin={plugin}>
        <ImportPackageNameProvider getImportPackageName={getImportPackageName}>
          <AlertProvider>
            <NotificationProvider>
              <PortalProvider>
                <Sandbox/>
              </PortalProvider>
            </NotificationProvider>
          </AlertProvider>
        </ImportPackageNameProvider>
      </PluginProvider>
    </ThemeProvider>
  </Root>
))
