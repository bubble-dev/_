import { setupTheme } from '@themeables/core'
import type { TThemeables } from '@themeables/core'
import type { TThemeableBackground } from './types'

export type { TThemeBackground, TThemeableBackground, TThemeableBackgrounds } from './types'

export const setupBackgroundTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableBackground, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground, ComponentMappings>(defaultTheme)

  return {
    BackgroundTheme: ThemePiece,
    createThemeableBackground: createThemeable,
  }
}
