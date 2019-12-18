import { createContext } from 'react'
import { TTheme } from '../../types'

export type TThemeContext = {
  theme: TTheme,
}

export const ThemeContext = createContext<TThemeContext>({} as TThemeContext)
