import { setupTheme } from '@themeables/core'
import type { TThemeables } from '@themeables/core'
import type { TThemeableLayout } from './types'

export type { TThemeLayout, TThemeableLayout, TThemeableLayouts } from './types'

export const setupLayoutTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableLayout, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableLayout, ComponentMappings>(defaultTheme)

  return {
    LayoutTheme: ThemePiece,
    createThemeableLayout: createThemeable,
  }
}
