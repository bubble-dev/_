import { setupTheme } from '@themeables/core3'
import type { TThemeableBackground } from './types'

export type { TThemeBackground, TThemeableBackground, TThemeableBackgrounds } from './types'

export const setupBackgroundTheme = (overrideContext = {}) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground>(overrideContext)

  return {
    BackgroundTheme: ThemePiece,
    createThemeableBackground: createThemeable,
  }
}
