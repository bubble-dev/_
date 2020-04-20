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
  onChange: (id: string, value: string, evt?: any) => void,
}
