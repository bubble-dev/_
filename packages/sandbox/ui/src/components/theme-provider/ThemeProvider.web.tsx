import React from 'react'
import { component, startWithType, mapState, onMount } from 'refun'
import { isUndefined } from 'tsfn'
import { ThemeContext } from './ThemeContext'
import { TThemeProvider } from './types'

export const ThemeProvider = component(
  startWithType<TThemeProvider>(),
  mapState('theme', 'setTheme', ({ theme }) => theme, ['theme']),
  onMount(async ({ theme, setTheme }) => {
    if (isUndefined(theme)) {
      const { defaultTheme } = await import('./default-theme')

      setTheme(defaultTheme)
    }
  })
)(({ theme, children }) => {
  if (isUndefined(theme)) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
})
