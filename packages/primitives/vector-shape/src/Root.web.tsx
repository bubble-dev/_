import React from 'react'
import { Block } from '@primitives/block'
import { component, startWithType, mapWithProps, mapDefaultProps } from 'refun'
import { Surface, Shape } from '@primitives/svg'
import { colorToString } from 'colorido'
import { TStyle } from 'stili'
import { TVectorShape } from './types'

export const VectorShape = component(
  startWithType<TVectorShape>(),
  mapDefaultProps({
    color: [0, 0, 0, 1],
  }),
  mapWithProps(({ scale }) => {
    const style: TStyle = {}

    let transform = ''

    if (typeof scale !== 'undefined') {
      transform += `scale(${scale})`
    }

    if (transform.length > 0) {
      style.transform = transform
    }

    return {
      style,
    }
  })
)(({ color, height, id, path, style, width }) => (
  <Block shouldIgnorePointerEvents style={style}>
    <Surface id={id} height={height} width={width}>
      <Shape
        d={path}
        fill={colorToString(color)}
      />
    </Surface>
  </Block>
))

VectorShape.displayName = 'VectorShape'
