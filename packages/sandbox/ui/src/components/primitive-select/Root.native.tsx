import React from 'react'
import { Picker } from 'react-native'
import type { ViewStyle } from 'react-native'
import { component, mapWithProps, startWithType } from 'refun'
import type { TPrimitiveSelect } from './types'

export const PrimitiveSelect = component(
  startWithType<TPrimitiveSelect>(),
  mapWithProps(({
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  }) => {
    const style: ViewStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    }

    return {
      style,
    }
  })
)(({
  children,
  id,
  accessibilityLabel,
  isDisabled,
  style,
  value,
  onChange,
}) => (
  <Picker
    testID={id}
    enabled={!isDisabled}
    style={style}
    selectedValue={value}
    onValueChange={onChange}
    accessibilityLabel={accessibilityLabel}
  >
    {children}
  </Picker>
))

PrimitiveSelect.displayName = 'PrimitiveSelect'
