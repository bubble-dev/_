import { createContext } from 'react'
import { TColor } from 'colorido'

export type TButtonIconSwitchThemeContext = {
  backgroundColor: TColor,
  hoveredBackgroundColor: TColor,
  pressedBackgroundColor: TColor,
  activeBackgroundColor: TColor,
  activeHoveredBackgroundColor: TColor,
  activePressedBackgroundColor: TColor,
  focusedBorderColor: TColor,
  activeFocusedBorderColor: TColor,
  iconColor: TColor,
  hoveredIconColor: TColor,
  pressedIconColor: TColor,
  activeIconColor: TColor,
  activeHoveredIconColor: TColor,
  activePressedIconColor: TColor,
}

export const ButtonIconSwitchThemeContext = createContext<TButtonIconSwitchThemeContext>({
  backgroundColor: [255, 255, 255, 1],
  hoveredBackgroundColor: [255, 255, 255, 1],
  pressedBackgroundColor: [255, 255, 255, 1],
  activeBackgroundColor: [255, 255, 255, 1],
  activeHoveredBackgroundColor: [255, 255, 255, 1],
  activePressedBackgroundColor: [255, 255, 255, 1],
  focusedBorderColor: [255, 255, 255, 1],
  activeFocusedBorderColor: [255, 255, 255, 1],
  iconColor: [0, 0, 0, 1],
  hoveredIconColor: [0, 0, 0, 1],
  pressedIconColor: [0, 0, 0, 1],
  activeIconColor: [0, 0, 0, 1],
  activeHoveredIconColor: [0, 0, 0, 1],
  activePressedIconColor: [0, 0, 0, 1],
})
