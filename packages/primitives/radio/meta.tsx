import React, { useState } from 'react'
import { TComponentConfig } from 'autoprops'
import { component, startWithType } from 'refun'
import { Block } from '@primitives/block'
import { Text } from '@primitives/text'
import { RadioInput, RadioGroup, TRadioInput, TRadioGroup } from './src'
import { RadioContext } from './src/context'

// This Component will be passed by the consumer,
// but without it, it's quite pointless to have
// RadioInput on Sandbox.
type TPresentationProps = {
  value: string,
  isDisabled?: boolean,
}

const PresentationElement = ({ isDisabled, value }: TPresentationProps) => (
  <RadioContext.Consumer>
    {({ groupValue }) => (
      <Block style={{
        fontFamily: 'sans-serif',
        fontSize: 20,
        color: isDisabled ? 'grey' : 'hotpink',
        fontWeight: groupValue === value ? 800 : 400,
      }}
      >
        <Text> {value}</Text>
      </Block>
    )}
  </RadioContext.Consumer>
)

export const Component = component(
  startWithType<TRadioInput & TRadioGroup>()
)(({ value, ...radioInputProps }) => {
  const [groupValue, setGroupValue] = useState(value)

  return (
    <RadioGroup
      groupValue={groupValue}
      onChange={setGroupValue}
    >
      <Block style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around',
      }}
      >
        <RadioInput value={value} {...radioInputProps}>
          <PresentationElement value={value} {...radioInputProps}/>
        </RadioInput>
        <RadioInput {...radioInputProps} id="foo" value="test-foo">
          <PresentationElement {...radioInputProps} value="test-foo"/>
        </RadioInput>
      </Block>
    </RadioGroup>
  )
})

Component.displayName = 'RadioInput'

type TRadioMetaConfig = Pick<TRadioGroup & TRadioInput, 'value' | 'groupName' | 'id' | 'isDisabled' | 'isVisible'| 'onFocus'| 'onBlur'| 'onPress' |'onChange'>

export const config: TComponentConfig<TRadioMetaConfig> = {
  props: {
    value: ['foobar'],
    groupName: ['test-group'],
    id: ['radio-test'],
    isDisabled: [true],
    isVisible: [true],
    onChange: [() => {}],
    onFocus: [(evt) => {
      console.log('Meta file onFocus called', evt)
    }],
    onBlur: [(evt) => {
      console.log('Meta file onBlur called', evt)
    }],
    onPress: [(evt) => {
      console.log('Meta file onPress called', evt)
    }],
  },
  required: ['value', 'onChange', 'onPress', 'onBlur', 'onFocus', 'groupName', 'id'],
}

export { default as packageJson } from './package.json'
