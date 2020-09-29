import { setupTheme } from '@themeables/core'
import type { TThemeables, TOverrideContext } from '@themeables/core'
import type { TThemeableLayout } from './types'

export type { TThemeLayout, TThemeableLayout, TThemeableLayouts } from './types'

export const setupLayoutTheme = <ComponentMappings>(
  defaultTheme: TThemeables<TThemeableLayout, ComponentMappings>,
  overrideTheme?: TOverrideContext<TThemeableLayout, ComponentMappings>
) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableLayout, ComponentMappings>(defaultTheme, overrideTheme)

  return {
    LayoutTheme: ThemePiece,
    createThemeableLayout: createThemeable,
  }
}
