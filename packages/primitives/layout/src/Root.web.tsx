import React from 'react'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { View } from '@primitives/view'
import { isNumber } from 'tsfn'
import { TLayout } from './types'
import { Context } from './context'

export const Layout = component(
  startWithType<TLayout>(),
  mapDefaultProps({
    minWidth: 0,
    minHeight: 0,
    hAlign: 'left',
    vAlign: 'top',
  }),
  mapProps(({
    direction,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    hAlign,
    vAlign,
    children,
  }) => {
    const style: TStyle = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      flexShrink: 1,
      alignSelf: 'stretch',
      minWidth,
      minHeight,
    }

    if (direction === 'horizontal' || direction === 'horizontal-reverse') {
      style.flexDirection = direction === 'horizontal' ? 'row' : 'row-reverse'

      switch (hAlign) {
        case 'left': {
          style.justifyContent = 'flex-start'

          break
        }
        case 'center': {
          style.justifyContent = 'center'

          break
        }
        case 'right': {
          style.justifyContent = 'flex-end'

          break
        }
      }

      switch (vAlign) {
        case 'top': {
          style.alignItems = 'flex-start'

          break
        }
        case 'center': {
          style.alignItems = 'center'

          break
        }
        case 'bottom': {
          style.alignItems = 'flex-end'

          break
        }
      }
    } else if (direction === 'vertical' || direction === 'vertical-reverse') {
      style.flexDirection = direction === 'vertical' ? 'column' : 'column-reverse'

      switch (hAlign) {
        case 'left': {
          style.alignItems = 'flex-start'

          break
        }
        case 'center': {
          style.alignItems = 'center'

          break
        }
        case 'right': {
          style.alignItems = 'flex-end'

          break
        }
      }

      switch (vAlign) {
        case 'top': {
          style.justifyContent = 'flex-start'

          break
        }
        case 'center': {
          style.justifyContent = 'center'

          break
        }
        case 'bottom': {
          style.justifyContent = 'flex-end'

          break
        }
      }
    }

    if (isNumber(maxWidth)) {
      style.maxWidth = maxWidth
    }

    if (isNumber(maxHeight)) {
      style.maxHeight = maxHeight
    }

    if (isNumber(width)) {
      style.width = width
      style.flexGrow = 0
      style.flexShrink = 0
    }

    if (isNumber(height)) {
      style.height = height
      style.alignSelf = 'auto'
    }

    return {
      style: normalizeStyle(style),
      direction,
      children,
    }
  })
)(({ children, direction, style }) => (
  <View style={style}>
    <Context.Provider value={{ direction }}>
      {children}
    </Context.Provider>
  </View>
))

Layout.displayName = 'Layout'
