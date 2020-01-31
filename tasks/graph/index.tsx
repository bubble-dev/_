import React from 'react'
import { App as Graph } from 'graph'
import data from './data.json'

export const App = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    <Graph entries={data.entries7}/>
    <Graph entries={data.entries4}/>
    <Graph entries={data.entries1}/>
    <Graph entries={data.entries3}/>
    <Graph entries={data.entries5}/>
    <Graph entries={data.entries6}/>
    <Graph entries={data.entries2}/>
    <Graph entries={data.entries8}/>
    <Graph entries={data.entries9}/>
  </div>
)
