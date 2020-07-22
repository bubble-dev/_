import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableTextAlign } from './types'

export * from './types'

export const setupTextAlignTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableTextAlign, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableTextAlign, ComponentMappings>(defaultTheme)

  return {
    TextAlignTheme: ThemePiece,
    createThemeableTextAlign: createThemeable,
  }
}
