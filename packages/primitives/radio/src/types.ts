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
  marginTop?: number,
  marginLeft?: number,
  marginBottom?: number,
  marginRight?: number,
  onChange: (id: string, value: string, evt?: any) => void,
}


const radios = [
  {
    id: 'foo',
    value: 'foo-value'
  },
  {
    id: 'foo-2',
    value: 'foo-value-2'
  },
  {
    id: 'foo-3',
    value: 'foo-value-3'
  },
]

const RadioGroup = ({ defaultValue}) => {
  const [groupValue, setGroupValue] = useState(defaultValue)

  return (<>
      {radios.map((radio => (
        <RadioPrimitive
          id={id}
          value={value}
          groupValue={groupValue}
          onChange={() => { setGroupValue(newValue)}}
          />
      )))}
    </>)
}
