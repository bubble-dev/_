import { createContext } from 'react'
import { TColor } from 'colorido'

export type TSwitchThemeContext = {
  backgroundColor: TColor,
  activeBackgroundColor: TColor,
  hoveredBackgroundColor: TColor,
  activeHoveredBackgroundColor: TColor,
  pressedBackgroundColor: TColor,
  activePressedBackgroundColor: TColor,
  focusedOuterBorderColor: TColor,
  activeFocusedOuterBorderColor: TColor,
  iconColor: TColor,
  activeIconColor: TColor,
  hoveredIconColor: TColor,
  activeHoveredIconColor: TColor,
  pressedIconColor: TColor,
  activePressedIconColor: TColor,
}

export const SwitchThemeContext = createContext<TSwitchThemeContext>({
  backgroundColor: [255, 255, 255, 1],
  activeBackgroundColor: [255, 255, 255, 1],
  hoveredBackgroundColor: [255, 255, 255, 1],
  activeHoveredBackgroundColor: [255, 255, 255, 1],
  pressedBackgroundColor: [255, 255, 255, 1],
  activePressedBackgroundColor: [255, 255, 255, 1],
  focusedOuterBorderColor: [255, 255, 255, 1],
  activeFocusedOuterBorderColor: [255, 255, 255, 1],
  iconColor: [0, 0, 0, 1],
  activeIconColor: [0, 0, 0, 1],
  hoveredIconColor: [0, 0, 0, 1],
  activeHoveredIconColor: [0, 0, 0, 1],
  pressedIconColor: [0, 0, 0, 1],
  activePressedIconColor: [0, 0, 0, 1],
})
