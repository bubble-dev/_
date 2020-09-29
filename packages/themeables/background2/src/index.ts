import { createThemeable } from '@themeables/core2'
import type { TThemeables } from '@themeables/core2'
import type { FC } from 'react'
import type { TThemeableBackground } from './types'

export type { TThemeBackground, TThemeableBackground, TThemeableBackgrounds } from './types'

export const createThemeableBackground = <TargetProps extends TThemeableBackground, ComponentMappings>(
  name: keyof ComponentMappings,
  Target: FC<any>,
  theme: React.Context<TThemeables<TThemeableBackground, ComponentMappings>>,
  overrides?: React.Context<TThemeables<TThemeableBackground, ComponentMappings>>
) => {
  return createThemeable<TargetProps, TThemeableBackground, ComponentMappings>(name, Target, theme, overrides)
}
