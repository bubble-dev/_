`Radio` brings the equivalent of an `<input type="radio" />` to Native land.

## Handling changes

- `onChange`: is triggered every time the element is selected. Receives `event`, `value`, `id`

These map to the same corresponding props in Web and in React Native.

## Raw type definitions

```ts
export type TRadioInputProps = {
  id: string,
  groupName: string,
  groupValue: string,
  value: string,
  isChecked?: boolean,
  key?: string,
  accessibilityLabel?: string,
  accessibilityLabelBy?: string[],
  isDisabled?: boolean,
  onChange: (id: string, newValue: string, event: any) => void,
}
```

