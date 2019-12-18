import { createContext } from 'react'
import { TColor } from 'colorido'
import { TStyle } from 'stili'

export type TFieldThemeContext = {
  color: TColor,
  placeholderColor: TColor,
  fontSize: number,
  lineHeight: number,
  fontFamily: string,
  fontWeight: TStyle['fontWeight'],
  height: number,
  leftPadding: number,
  rightPadding: number,
}

export const FieldThemeContext = createContext<TFieldThemeContext>({
  color: [0, 0, 0, 1],
  placeholderColor: [0, 0, 0, 1],
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
  height: 20,
  leftPadding: 0,
  rightPadding: 0,
})
