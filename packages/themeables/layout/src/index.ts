import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableLayout } from './types'

export * from './types'

export const setupLayoutTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableLayout, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableLayout, ComponentMappings>(defaultTheme)

  return {
    LayoutTheme: ThemePiece,
    createThemeableLayout: createThemeable,
  }
}
