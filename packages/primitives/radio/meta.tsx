import React from 'react'
import { TComponentConfig } from 'autoprops'
import { component, startWithType, mapState, mapHandlers } from 'refun'
import { RadioInput, TRadioInput } from './src'

export const Component = component(
  startWithType<TRadioInput>(),
  mapState('groupValue', 'setGroupValue', ({ value }) => value, ['value']),
  mapHandlers({
    onChange: ({ onChange, setGroupValue }) => (id: string, value: string) => {
      setGroupValue(value)
      onChange(id, value)
    },
  })
)((props) => (
  <>
    <RadioInput {...props}/>
    <RadioInput {...props} id="foo" value="test-foo"/>
  </>
))

Component.displayName = 'RadioInput'

export const config: TComponentConfig<TRadioInput> = {
  props: {
    groupValue: [''],
    groupName: ['test-group'],
    id: ['radio-test'],
    isDisabled: [true],
    color: [[0xff, 0x00, 0x00, 1]],
    paddingLeft: [10],
    paddingTop: [10],
    paddingRight: [10],
    paddingBottom: [10],
    value: ['value'],
    onChange: [(id, value) => {
      console.log('Meta file onChange called', id, value)
    }],
  },
  required: ['value', 'onChange', 'groupName', 'id'],
  mutin: [
    ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'],
  ],
}

export { default as packageJson } from './package.json'
