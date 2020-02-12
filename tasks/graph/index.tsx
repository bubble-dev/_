import React from 'react'
import { App as Graphs } from 'graph'
import { getObjectEntries, isDefined } from 'tsfn'
import { TGraph } from 'graph/src/types'
import { TColor } from 'colorido'
import data from './data-prod.json'

const theme = {
  firstContentfulPaint: [46, 134, 193, 1] as TColor,
  firstMeaningfulPaint: [142, 68, 173, 1] as TColor,
  largestContentfulPaint: [155, 89, 182, 1] as TColor,
  domContentLoaded: [231, 76, 60, 1] as TColor,
  threadTime: [23, 165, 137, 1] as TColor,
  scriptDuration: [241, 196, 15, 1] as TColor,
  layoutDuration: [230, 126, 34, 1] as TColor,
  recalcStyleDuration: [93, 109, 126, 1] as TColor,
  usedJsHeapSize: [240, 178, 122, 1] as TColor,
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
