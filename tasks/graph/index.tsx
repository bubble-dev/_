import React from 'react'
import { App as Graphs } from 'graph'
import { getObjectEntries, isDefined } from 'tsfn'
import { TGraph } from 'graph/src/types'
import data from './data-prod.json'

const theme = {
  firstContentfulPaint: [46, 134, 193, 1],
  firstMeaningfulPaint: [142, 68, 173, 1],
  largestContentfulPaint: [155, 89, 182, 1],
  domContentLoaded: [231, 76, 60, 1],
  threadTime: [23, 165, 137, 1],
  scriptDuration: [241, 196, 15, 1],
  layoutDuration: [230, 126, 34, 1],
  recalcStyleDuration: [93, 109, 126, 1],
  usedJsHeapSize: [240, 178, 122, 1],
}
const graphs = data.reduce((acc, cur) => {
  for (const [key, value] of getObjectEntries(cur.values)) {
    const graph = acc.find((el) => el.key === key)

    if (isDefined(graph)) {
      graph.values.push({
        version: key,
        value,
      })
    } else {
      acc.push({
        key,
        color: theme[key],
        values: [],
      })
    }
  }

  return acc
}, [] as TGraph[])

export const App = () => (
  <Graphs graphs={graphs}/>
)
