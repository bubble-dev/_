import React from 'react'
import { TComponentConfig } from 'autoprops'
import { component, startWithType } from 'refun' // mapState,
import { RadioInput, RadioGroup, TRadioInput } from './src'

export const Component = component(
  startWithType<TRadioInput>()
)(({ groupValue, ...radioInputProps }) => {
  console.log('meta groupValue:', groupValue)

  return (
    <RadioGroup
      initialValue={groupValue}
    >
      <RadioInput {...radioInputProps}/>
      <RadioInput {...radioInputProps} id="foo" value="test-foo"/>
    </RadioGroup>
  )
})

Component.displayName = 'RadioInput'

export const config: TComponentConfig<TRadioInput> = {
  props: {
    groupValue: ['value'],
    groupName: ['test-group'],
    id: ['radio-test'],
    isDisabled: [true],
    value: ['value'],
    onChange: [(evt) => {
      console.log('Meta file onChange called', evt)
    }],
  },
  required: ['value', 'onChange', 'groupName', 'groupValue', 'id'],
}

export { default as packageJson } from './package.json'
