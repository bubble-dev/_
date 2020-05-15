import { ReactNode, ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react'

export type TRadioContext = {
  groupValue: string,
  setGroupValue: (arg: string) => void,
}

export type TRadioInput = {
  key?: string,
  id: string,
  groupName: string,
  value: string,
  accessibilityLabel?: string,
  accessibilityLabelBy?: string[],
  isDisabled?: boolean,
  isVisible?: boolean,
  children: ReactNode,
  onChange: (evt: any) => void,
  onBlur: (evt: any) => void,
  onFocus: (evt: any) => void,
  onPress: (evt: any) => void,
}

export type TRadioGroup = {
  initialValue: string,
  children: ReactNode,
}

export type TCallbackEvent = ChangeEvent<HTMLInputElement>
|FocusEvent<InputEvent>
|KeyboardEvent<InputEvent>
|ReactMouseEvent<HTMLInputElement>
