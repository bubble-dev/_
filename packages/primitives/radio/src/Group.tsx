import React from 'react'
import { component, startWithType, mapState } from 'refun'
import { RadioContext } from './context'
import { TRadioGroup } from './types'

const RadioGroup = component(
  startWithType<TRadioGroup>(),
  mapState(
    'groupValue', 'setGroupValue', ({ initialValue }) => initialValue, []
  )
)(({
  groupValue,
  setGroupValue,
  children,
}) => {
  return (
    <RadioContext.Provider value={{ groupValue, setGroupValue }}>
      {children}
    </RadioContext.Provider>
  )
})

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup }
