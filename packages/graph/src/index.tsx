import React, { FC } from 'react'
import { Root } from '@primitives/root'
import { TEntry } from './types'
import { GraphApp } from './GraphApp'

export type TApp = {
  entries: TEntry[],
}

export const App: FC<TApp> = ({ entries }) => (
  // <Root>
  //   {({ width, height }) => (
  //     <GraphApp
  //       entries={entries}
  //       height={height}
  //       width={width}
  //     />
  //   )}
  // </Root>
  <GraphApp
    entries={entries}
    height={340}
    width={640}
  />
)

App.displayName = 'App'
