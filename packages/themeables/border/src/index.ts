import { setupTheme } from '@themeables/core'
import type { TThemeables, TOverrideContext } from '@themeables/core'
import type { TThemeableBorder } from './types'

export type { TThemeBorder, TThemeableBorder, TThemeableBorders } from './types'

export const setupBorderTheme = <ComponentMappings>(
  defaultTheme: TThemeables<TThemeableBorder, ComponentMappings>,
  overrideTheme?: TOverrideContext<TThemeableBorder, ComponentMappings>
) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBorder, ComponentMappings>(defaultTheme, overrideTheme)

  return {
    BorderTheme: ThemePiece,
    createThemeableBorder: createThemeable,
  }
}
