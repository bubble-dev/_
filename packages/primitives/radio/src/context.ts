import React from 'react'
import { TRadioContext } from './types'

const RadioContext = React.createContext<TRadioContext>({
  groupName: '',
  groupValue: '',
  setGroupValue: () => {},
})

RadioContext.displayName = 'RadioContext'

export { RadioContext }
