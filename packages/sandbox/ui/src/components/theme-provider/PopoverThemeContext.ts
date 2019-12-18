import { createContext } from 'react'
import { TColor } from 'colorido'

export type TPopoverThemeContext = {
  backgroundColor: TColor,
}

export const PopoverThemeContext = createContext<TPopoverThemeContext>({
  backgroundColor: [255, 255, 255, 1],
})
