import { TStyle } from 'stili'
import { TColor } from 'colorido'

export type TInput = {
  id?: string,
  accessibilityLabel?: string,
  isDisabled?: boolean,
  color?: TColor,
  fontFamily?: string,
  fontWeight?: TStyle['fontWeight'],
  fontSize?: number,
  lineHeight?: number,
  letterSpacing?: number,
  paddingBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  value: string,
  onChange: (newValue: string) => void,
  onSubmit?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
}
