import { setupTheme } from '@themeables/core'
import type { TThemeables } from '@themeables/core'
import type { TThemeableSpacer } from './types'

export type { TThemeSpacer, TThemeableSpacer, TThemeableSpacers } from './types'

export const setupSpacerTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableSpacer, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableSpacer, ComponentMappings>(defaultTheme)

  return {
    SpacerTheme: ThemePiece,
    createThemeableSpacer: createThemeable,
  }
}
