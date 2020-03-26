import React from 'react'
import { View } from '@primitives/view'
import { component, startWithType, mapWithProps, mapDefaultProps } from 'refun'
import { Surface, Shape } from '@primitives/svg'
import { colorToString } from 'colorido'
import { TVectorShape } from './types'
import { normalizeStyle } from 'stili'

export const VectorShape = component(
  startWithType<TVectorShape>(),
  mapDefaultProps({
    color: [0, 0, 0, 1],
  }),
  mapWithProps(({ scale }) => {
    const transform = []

    if (typeof scale !== 'undefined') {
      transform.push({ scale })
    }

    return {
      style: normalizeStyle({
        transform,
      }),
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
