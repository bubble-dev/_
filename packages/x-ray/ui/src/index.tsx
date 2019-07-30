import React, { FC } from 'react'
import { StoreProvider } from './store'
import { Index } from './components'

export const App: FC<{}> = () => (
  <StoreProvider>
    <Index/>
  </StoreProvider>
)
