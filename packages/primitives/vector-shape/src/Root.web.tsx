import React from 'react'
import { View } from '@primitives/view'
import { component, startWithType, mapWithProps, mapDefaultProps } from 'refun'
import { Surface, Shape } from '@primitives/svg'
import { colorToString } from 'colorido'
import { TVectorShape } from './types'
import { normalizeStyle, TStyle } from 'stili'

export const VectorShape = component(
  startWithType<TVectorShape>(),
  mapDefaultProps({
    color: [0, 0, 0, 1],
  }),
  mapWithProps(({ scale }) => {
    const style: TStyle = {}

    let transform = ''

    if (typeof scale !== 'undefined') {
      if (transform.length > 0) {
        transform += ' '
      }

      transform += `scale(${scale}, ${scale})`
    }

    if (transform.length > 0) {
      style.transform = transform
    }

    return {
      style: normalizeStyle(style),
    }
  })
)(({ color, height, id, path, style, width }) => (
  <View style={style}>
    <Surface id={id} height={height} width={width}>
      <Shape
        d={path}
        fill={colorToString(color)}
      />
    </Surface>
  </View>
))

VectorShape.displayName = 'VectorShape'
