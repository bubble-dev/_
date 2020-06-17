import React from 'react'
import { component, startWithType, mapWithPropsMemo, onLayout, mapRef } from 'refun'
import { normalizeWebStyle, TStyle } from 'stili'
import { isFunction, isNumber } from 'tsfn'
import { round } from './round'
import { TSize } from './types'

export const Size = component(
  startWithType<TSize>(),
  mapWithPropsMemo(({ left, top, maxWidth, maxHeight, shouldPreventWrap }) => {
    const parentStyle: TStyle = {
      display: 'flex',
      left: 0,
      top: 0,
      position: 'absolute',
    }
    const childStyle: TStyle = {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 'auto',
    }

    if (isNumber(left)) {
      parentStyle.left = left
    }

    if (isNumber(top)) {
      parentStyle.top = top
    }

    if (isNumber(maxWidth) && maxWidth > 0) {
      childStyle.maxWidth = maxWidth
    }

    if (isNumber(maxHeight) && maxHeight > 0) {
      childStyle.maxHeight = maxHeight
    }

    if (shouldPreventWrap) {
      childStyle.display = 'flex'
    }

    return {
      parentStyle: normalizeWebStyle(parentStyle),
      childStyle: normalizeWebStyle(childStyle),
    }
  }, ['maxWidth', 'maxHeight', 'left', 'top', 'shouldPreventWrap']),
  mapRef('ref', null as null | HTMLDivElement),
  onLayout(({ ref, width, height, onWidthChange, onHeightChange }) => {
    const shouldMeasureWidth = isNumber(width) && isFunction(onWidthChange)
    const shouldMeasureHeight = isNumber(height) && isFunction(onHeightChange)

    if (ref.current !== null && (shouldMeasureWidth || shouldMeasureHeight)) {
      const rect = ref.current.firstElementChild!.getBoundingClientRect()

      const measuredWidth = round(rect.width)
      const measuredHeight = round(rect.height)

      if (shouldMeasureWidth && width !== measuredWidth) {
        onWidthChange!(measuredWidth)
      }

      if (shouldMeasureHeight && height !== measuredHeight) {
        onHeightChange!(measuredHeight)
      }
    }
  }, ['children'])
)(({ ref, parentStyle, childStyle, children }) => (
  <div style={parentStyle}>
    <div style={childStyle} ref={ref}>
      {children}
    </div>
  </div>
))

Size.displayName = 'Size'
