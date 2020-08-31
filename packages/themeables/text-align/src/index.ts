import { setupTheme } from '@themeables/core'
import type { TThemeables } from '@themeables/core'
import type { TThemeableTextAlign } from './types'

export type { TAlign, TDirection, TThemeTextAlign, TThemeableTextAlign, TThemeableTextAligns } from './types'

export const setupTextAlignTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableTextAlign, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableTextAlign, ComponentMappings>(defaultTheme)

  return {
    TextAlignTheme: ThemePiece,
    createThemeableTextAlign: createThemeable,
  }
}
