import React from 'react'
import { App as Graph } from 'graph'
import data from './data.json'

export const App = () => (
  <div>
    <Graph entries={data.entries1}/>
    <Graph entries={data.entries3}/>
    <Graph entries={data.entries2}/>
  </div>
)
