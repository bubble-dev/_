import { createContext } from 'react'
import { TColor } from 'colorido'
import { TStyle } from 'stili'

export type TDropdownThemeContext = {
  color: TColor,
  hoveredColor: TColor,
  focusedBorderColor: TColor,
  fontSize: number,
  lineHeight: number,
  fontFamily: string,
  fontWeight: TStyle['fontWeight'],
  height: number,
}

export const DropdownThemeContext = createContext<TDropdownThemeContext>({
  color: [0, 0, 0, 1],
  hoveredColor: [0, 0, 0, 1],
  focusedBorderColor: [0, 0, 0, 1],
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
  height: 20,
})
