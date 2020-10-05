import { setupTheme } from '@themeables/core'
import type { TThemeables, TOverrideContext } from '@themeables/core'
import type { TThemeableImage } from './types'

export type { TThemeImage, TThemeableImage, TThemeableImages } from './types'

export const setupImageTheme = <ComponentMappings>(
  defaultTheme: TThemeables<TThemeableImage, ComponentMappings>,
  overrideTheme?: TOverrideContext<TThemeableImage, ComponentMappings>
) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableImage, ComponentMappings>(defaultTheme, overrideTheme)

  return {
    ImageTheme: ThemePiece,
    createThemeableImage: createThemeable,
  }
}
