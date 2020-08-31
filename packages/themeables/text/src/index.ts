import { setupTheme } from '@themeables/core'
import type { TThemeables } from '@themeables/core'
import type { TThemeableText } from './types'

export type { TThemeText, TThemeableText, TThemeableTexts } from './types'

export const setupTextTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableText, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableText, ComponentMappings>(defaultTheme)

  return {
    TextTheme: ThemePiece,
    createThemeableText: createThemeable,
  }
}
