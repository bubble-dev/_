import { setupTheme } from '@themeables/core'
import type { TThemeables, TOverrideContext } from '@themeables/core'
import type { TThemeableBackground } from './types'

export type { TThemeBackground, TThemeableBackground, TThemeableBackgrounds } from './types'

export const setupBackgroundTheme = <ComponentMappings>(
  defaultTheme: TThemeables<TThemeableBackground, ComponentMappings>,
  overrideTheme?: TOverrideContext<TThemeableBackground, ComponentMappings>
) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground, ComponentMappings>(defaultTheme, overrideTheme)

  return {
    BackgroundTheme: ThemePiece,
    createThemeableBackground: createThemeable,
  }
}
