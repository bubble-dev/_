import { setupTheme } from '@themeables/core'
import type { TThemeables } from '@themeables/core'
import type { TThemeableImage } from './types'

export type { TThemeImage, TThemeableImage, TThemeableImages } from './types'

export const setupImageTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableImage, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableImage, ComponentMappings>(defaultTheme)

  return {
    ImageTheme: ThemePiece,
    createThemeableImage: createThemeable,
  }
}
