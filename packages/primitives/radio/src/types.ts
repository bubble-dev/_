import { ReactNode, Dispatch, SetStateAction } from 'react'

export type TRadioContext = [
  string,
  Dispatch<SetStateAction<string>>,
]

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
