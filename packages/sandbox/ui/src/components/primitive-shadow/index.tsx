import React, { HTMLProps } from 'react'
import { component, startWithType, mapProps, mapDefaultProps } from 'refun'
import { normalizeWebStyle, TStyle } from 'stili'
import { colorToString } from '../../colors'
import { TPrimitiveShadow } from './types'

export * from './types'

export const PrimitiveShadow = component(
  startWithType<TPrimitiveShadow>(),
  mapDefaultProps({
    overflow: 0,
    offsetX: 0,
    offsetY: 0,
    blurRadius: 0,
    spreadRadius: 0,
  }),
  mapProps(({
    color,
    radius,
    overflow,
    blurRadius,
    spreadRadius,
    offsetX,
    offsetY,
  }) => {
    const styles: TStyle = {
      _webOnly: {
        pointerEvents: 'none',
        boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorToString(color)}`,
      },
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      left: -overflow,
      top: -overflow,
      right: -overflow,
      bottom: -overflow,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
    }

    const props: HTMLProps<HTMLDivElement> = {
      style: normalizeWebStyle(styles),
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveShadow.displayName = 'PrimitiveShadow'
