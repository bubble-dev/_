import { createContext } from 'react'
import { TColor } from 'colorido'
import { TStyle } from 'stili'

export type TTextThemeContext = {
  color: TColor,
  fontFamily: string,
  fontWeight: TStyle['fontWeight'],
  fontSize: number,
  lineHeight: number,
}

export const TextThemeContext = createContext<TTextThemeContext>({
  color: [0, 0, 0, 1],
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 20,
})
