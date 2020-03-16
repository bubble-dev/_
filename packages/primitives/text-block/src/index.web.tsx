import React from 'react'
import { component, startWithType, mapProps } from 'refun'
import { Block } from '@primitives/block'
import { Text } from '@primitives/text'
import { TBlockProps, TTextBlock } from './types'

export const TextBlock = component(
  startWithType<TTextBlock>(),
  mapProps(
    ({
      textAlign,
      snapStart,
      width,
      ...textProps
    }) => {
      const blockProps = {} as TBlockProps

      if (snapStart) {
        blockProps.marginTop = -snapStart
        blockProps.paddingTop = snapStart
      }

      if (width) {
        blockProps.width = width
      }

      if (textAlign) {
        blockProps.textAlign = textAlign
      }

      return {
        blockProps,
        textProps,
      }
    }
  )
)(({ blockProps, textProps }) => {
  return (
    <Block style={blockProps}>
      <Text {...textProps}/>
    </Block>
  )
})

TextBlock.displayName = 'TextBlock'
