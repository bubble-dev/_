import { ReactNode } from 'react'

export type TRadioInput = {
  id: string,
  groupName: string,
  groupValue: string,
  value: string,
  isChecked?: boolean,
  key?: string,
  accessibilityLabel?: string,
  accessibilityLabelBy?: string[],
  isDisabled?: boolean,
  onChange: (evt: any) => void,
}

export type TRadioGroup = {
  setGroupValue: () => {},
  initialValue: string,
  children: ReactNode,
}
