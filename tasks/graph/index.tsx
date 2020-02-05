import React from 'react'
import { App as Graphs } from 'graph'
import data from './data.json'

export const App = () => (
  <Graphs graphs={data}/>
)
