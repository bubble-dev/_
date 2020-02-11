import React from 'react'
import { App as Graphs } from 'graph'
import { getObjectEntries, isDefined } from 'tsfn'
import { TGraph } from 'graph/src/types'
import data from './data-prod.json'

const theme = {
  firstContentfulPaint: '46, 134, 193',
  firstMeaningfulPaint: '142, 68, 173',
  largestContentfulPaint: '155, 89, 182',
  domContentLoaded: '231, 76, 60',
  threadTime: '23, 165, 137 ',
  scriptDuration: '241, 196, 15',
  layoutDuration: '230, 126, 34',
  recalcStyleDuration: '93, 109, 126',
  usedJsHeapSize: '240, 178, 122',
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
        color: `rgb(${theme[key]})`,
        values: [],
      })
    }
  }

  return acc
}, [] as TGraph[])

export const App = () => (
  <Graphs graphs={graphs}/>
)
