import { ReactNode } from 'react'

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
  children?: ReactNode,
}

export type TRadioGroup = {
  groupValue: string,
  onChange: (arg: string) => void,
  children: ReactNode,
}
