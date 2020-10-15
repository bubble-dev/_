import { setupTheme } from '@themeables/core3'
import type { TThemeableBackground } from './types'

export type { TThemeBackground, TThemeableBackground, TThemeableBackgrounds } from './types'

export const setupBackgroundTheme = () => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground>()

  return {
    BackgroundTheme: ThemePiece,
    createThemeableBackground: createThemeable,
  }
}
