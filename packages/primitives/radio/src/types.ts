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
  onChange: (evt: any) => void,
}

export type TRadioGroup = {
  initialValue: string,
  children: ReactNode,
}
