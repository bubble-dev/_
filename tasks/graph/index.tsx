import React from 'react'
import { App as Graphs } from 'graph'
import data from './data-prod.json'

const graphs = data.reduce((acc, cur) => {
  for (const key in cur.values) {
    if (!acc[key]) {
      return acc
    }
    acc[key].values.push({
      version: cur.title,
      value: cur.values[key],
    })
  }

  return acc
}, {
  firstContentfulPaint: { color: 'red', values: [] },
  firstMeaningfulPaint: { color: 'blue', values: [] },
  largestContentfulPaint: { color: 'yellow', values: [] },
  domContentLoaded: { color: 'black', values: [] },
  threadTime: { color: 'green', values: [] },
  scriptDuration: { color: 'gray', values: [] },
  layoutDuration: { color: 'pink', values: [] },
  recalcStyleDuration: { color: '#ccc', values: [] },
  usedJsHeapSize: { color: 'red', values: [] },
})

export const App = () => (
  <Graphs graphs={graphs}/>
)
