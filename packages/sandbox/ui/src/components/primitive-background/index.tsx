import React, { HTMLProps } from 'react'
import { component, startWithType, mapProps, mapDefaultProps } from 'refun'
import { normalizeWebStyle, TStyle } from 'stili'
import { colorToString } from '../../colors'
import { TPrimitiveBackground } from './types'

export * from './types'

export const PrimitiveBackground = component(
  startWithType<TPrimitiveBackground>(),
  mapDefaultProps({
    overflow: 0,
  }),
  mapProps(({
    color,
    radius,
    overflow,
  }) => {
    const styles: TStyle = {
      _webOnly: {
        pointerEvents: 'none',
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
      backgroundColor: colorToString(color),
    }

    const props: HTMLProps<HTMLDivElement> = {
      style: normalizeWebStyle(styles),
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveBackground.displayName = 'PrimitiveBackground'
