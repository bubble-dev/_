import { createContext } from 'react'
import { TColor } from 'colorido'

export type TButtonIconThemeContext = {
  backgroundColor: TColor,
  hoveredBackgroundColor: TColor,
  pressedBackgroundColor: TColor,
  focusedBorderColor: TColor,
  iconColor: TColor,
  hoveredIconColor: TColor,
  pressedIconColor: TColor,
}

export const ButtonIconThemeContext = createContext<TButtonIconThemeContext>({
  backgroundColor: [255, 255, 255, 1],
  hoveredBackgroundColor: [255, 255, 255, 1],
  pressedBackgroundColor: [255, 255, 255, 1],
  focusedBorderColor: [255, 255, 255, 1],
  iconColor: [0, 0, 0, 1],
  hoveredIconColor: [0, 0, 0, 1],
  pressedIconColor: [0, 0, 0, 1],
})
