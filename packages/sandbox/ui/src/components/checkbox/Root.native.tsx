import React from 'react'
import { Switch, TouchableWithoutFeedback } from 'react-native'
import { normalizeStyle } from 'stili'
import { component, startWithType } from 'refun'
import { SYMBOL_CHECKBOX } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'
import { TCheckboxProps } from './types'

const style = normalizeStyle({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0,
})

export const Checkbox = component(
  startWithType<TCheckboxProps>()
)(({
  id,
  accessibilityLabel,
  isDisabled,
  isChecked,
  onToggle,
  onPressIn,
  onPressOut,
  children,
}) => (
  <TouchableWithoutFeedback
    accessibilityLabel={accessibilityLabel}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    disabled={isDisabled}
  >
    <SizeParentBlock>
      {children}
      <Switch
        value={isChecked}
        disabled={isDisabled}
        testID={id}
        style={style}
        onValueChange={onToggle}
      />
    </SizeParentBlock>
  </TouchableWithoutFeedback>
))

Checkbox.displayName = 'Checkbox'
Checkbox.componentSymbol = SYMBOL_CHECKBOX
