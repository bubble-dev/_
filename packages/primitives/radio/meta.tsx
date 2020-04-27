import React from 'react'
import { TComponentConfig } from 'autoprops'
import { component, startWithType } from 'refun'
import { RadioInput, RadioGroup, TRadioInput, TRadioGroup } from './src'

export const Component = component(
  startWithType<TRadioInput & TRadioGroup>()
)(({ initialValue, ...radioInputProps }) => {
  return (
    <RadioGroup
      initialValue={initialValue}
    >
      <RadioInput {...radioInputProps}/>
      <RadioInput {...radioInputProps} id="foo" value="test-foo"/>
    </RadioGroup>
  )
})

Component.displayName = 'RadioInput'

export const config: TComponentConfig<TRadioInput & TRadioGroup> = {
  props: {
    initialValue: ['value'],
    groupName: ['test-group'],
    id: ['radio-test'],
    isDisabled: [true],
    value: ['value'],
    onChange: [(evt) => {
      console.log('Meta file onChange called', evt)
    }],
  },
  required: ['value', 'onChange', 'groupName', 'initialValue', 'id'],
}

export { default as packageJson } from './package.json'
