import React from 'react'
import { TRadioContext } from './types'

const RadioContext = React.createContext<TRadioContext>([
  '',
  () => {},
])

RadioContext.displayName = 'RadioContext'

export { RadioContext }
