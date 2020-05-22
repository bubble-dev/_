import { TThemeableText } from '@themeables/text'
import { TThemeableSpacer } from '@themeables/spacer'

export type TInput = {
  accessibilityLabel?: string,
  id?: string,
  isDisabled?: boolean,
  onBlur?: () => void,
  onChange: (newValue: string) => void,
  onFocus?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onSubmit?: () => void,
  shouldUseNumberKeyboard?: boolean,
  value: string,
} & TThemeableText
  & TThemeableSpacer
