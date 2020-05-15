import React from 'react'
import { TComponentConfig } from 'autoprops'
import { component, startWithType } from 'refun'
import { RadioInput, RadioGroup, TRadioInput, TRadioGroup } from './src'
import { PresentationElement } from './src/presentation'

export const Component = component(
  startWithType<TRadioInput & TRadioGroup>()
)(({ initialValue, ...radioInputProps }) => (
  <RadioGroup
    initialValue={initialValue}
  >
    <RadioInput {...radioInputProps}>
      <PresentationElement {...radioInputProps}/>
    </RadioInput>
    <RadioInput {...radioInputProps} id="foo" value="test-foo">
      <PresentationElement {...radioInputProps} value="test-foo"/>
    </RadioInput>
  </RadioGroup>
))

Component.displayName = 'RadioInput'

export const config: TComponentConfig<TRadioInput & TRadioGroup> = {
  props: {
    initialValue: ['foobar'],
    groupName: ['test-group'],
    id: ['radio-test'],
    isDisabled: [true],
    value: ['value'],
    isVisible: [true],
    onChange: [(evt) => {
      console.log('Meta file onChange called', evt)
    }],
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
  required: ['value', 'onChange', 'onPress', 'onBlur', 'onFocus', 'groupName', 'initialValue', 'id'],
}

export { default as packageJson } from './package.json'
