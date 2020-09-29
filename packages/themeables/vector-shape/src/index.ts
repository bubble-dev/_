import { setupTheme } from '@themeables/core'
import type { TThemeables, TOverrideContext } from '@themeables/core'
import type { TThemeableVectorShape } from './types'

export type { TThemeVectorShape, TThemeableVectorShape, TThemeableVectorShapes } from './types'

export const setupVectorShapeTheme = <ComponentMappings>(
  defaultTheme: TThemeables<TThemeableVectorShape, ComponentMappings>,
  overrideTheme?: TOverrideContext<TThemeableVectorShape, ComponentMappings>
) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableVectorShape, ComponentMappings>(defaultTheme, overrideTheme)

  return {
    VectorShapeTheme: ThemePiece,
    createThemeableVectorShape: createThemeable,
  }
}
