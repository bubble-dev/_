import { createContext } from 'react'
import { TColor } from 'colorido'

export type TTooltipThemeContext = {
  backgroundColor: TColor,
  color: TColor,
}

export const TooltipThemeContext = createContext<TTooltipThemeContext>({
  backgroundColor: [255, 255, 255, 1],
  color: [0, 0, 0, 1],
})
