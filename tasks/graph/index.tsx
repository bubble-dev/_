import React from 'react'
import { App as Graphs } from 'graph'
import { getObjectEntries, isDefined } from 'tsfn'
import { TGraph } from 'graph/src/types'
import { TColor } from 'colorido'
import data from './data-prod.json'

const theme = {
  firstContentfulPaint: [[46, 134, 193, 1], [46, 193, 178, 1]] as TColor[],
  firstMeaningfulPaint: [[192, 57, 43, 1], [239, 105, 47, 1]] as TColor[],
  largestContentfulPaint: [[155, 89, 182, 1], [232, 118, 210, 1]] as TColor[],
  domContentLoaded: [[231, 76, 60, 1], [231, 162, 60, 1]] as TColor[],
  threadTime: [[23, 165, 137, 1], [74, 245, 126, 1]] as TColor[],
  scriptDuration: [[90, 68, 173, 1], [153, 100, 175, 1]] as TColor[],
  layoutDuration: [[230, 126, 34, 1], [230, 224, 34, 1]] as TColor[],
  recalcStyleDuration: [[88, 131, 250, 1], [88, 211, 250, 1]] as TColor[],
  usedJsHeapSize: [[22, 160, 133, 1], [83, 228, 200, 1]] as TColor[],
  vendorSize: [[90, 68, 173, 1], [153, 100, 175, 1]] as TColor[],
  vendorSizeGzip: [[230, 126, 34, 1], [230, 224, 34, 1]] as TColor[],
  mainSize: [[88, 131, 250, 1], [88, 211, 250, 1]] as TColor[],
  mainSizeGzip: [[22, 160, 133, 1], [83, 228, 200, 1]] as TColor[],
}
const graphs = data.reduce((acc, cur) => {
  for (const [key, value] of getObjectEntries(cur.values)) {
    const graph = acc.find((el) => el.key === key)

    // if (key !== 'firstContentfulPaint') {
    //   return acc
    // }

    if (isDefined(graph)) {
      graph.values.push({
        version: key,
        value,
      })
    } else {
      acc.push({
        key,
        colors: theme[key],
        values: [],
      })
    }
  }

  return acc
}, [] as TGraph[])

export const App = () => (
  <Graphs graphs={graphs}/>
)
