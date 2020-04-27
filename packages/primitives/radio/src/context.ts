import React from 'react'
import { TRadioContext } from './types'

const RadioContext = React.createContext<TRadioContext>({
  groupValue: '',
  setGroupValue: () => {},
})

RadioContext.displayName = 'RadioContext'

export { RadioContext }
