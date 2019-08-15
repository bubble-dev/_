import React from 'react'
import { component, startWithType } from 'refun'
import { TRect, TGridItem } from '../../types'
import { Block } from '../Block'
import { LineElement } from './LineElement'
import { LINE_HEIGHT } from './constants'

export type TSourceCode = TRect & {
  selectedItem: TGridItem,
}

export const SourceCode = component(
  startWithType<TSourceCode>()
)(({ top, left, width, height, selectedItem }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    shouldScroll
  >
    <Block height={selectedItem.serializedElement.length * LINE_HEIGHT} shouldFlow/>
    {selectedItem.serializedElement.map((line, i) => (
      <Block key={i} left={0} top={i * LINE_HEIGHT} right={0} height={LINE_HEIGHT}>
        {line.map((element, i) => (
          <LineElement key={i} type={element.type}>
            {element.value}
          </LineElement>
        ))}
      </Block>
    ))}
  </Block>
))
