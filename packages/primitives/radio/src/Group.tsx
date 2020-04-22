import React, { useState } from 'react'
import { component, startWithType } from 'refun'
import { RadioContext } from './context'
import { TRadioGroup } from './types'

const RadioGroup = component(
  startWithType<TRadioGroup>()
)(({
  initialValue,
  children,
}) => {
  const radioState = useState(initialValue)

  return (
    <RadioContext.Provider value={radioState}>
      {children}
    </RadioContext.Provider>
  )
})

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup }
