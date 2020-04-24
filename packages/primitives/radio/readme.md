`Radio` brings the equivalent of an `<input type="radio" />` to Native land.

## Handling changes

- `onChange`: is triggered every time the element is selected. Receives the fired `event`

These map to the same corresponding props in Web and in React Native.

## Raw type definitions

```
type TRadioContext = [
  string,
  Dispatch<SetStateAction<string>>,
]

type TRadioInput = {
  key?: string,
  id: string,
  groupName: string,
  value: string,
  accessibilityLabel?: string,
  accessibilityLabelBy?: string[],
  isDisabled?: boolean,
  onChange: (evt: any) => void,
}

type TRadioGroup = {
  initialValue: string,
  children: ReactNode,
}
```

