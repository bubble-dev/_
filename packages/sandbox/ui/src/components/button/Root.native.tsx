import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { startWithType, component } from 'refun'
import { SYMBOL_BUTTON } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'
import { TButton } from './types'

const hitSlop = {
  bottom: 5,
  left: 5,
  right: 5,
  top: 5,
}

export const Button = component(
  startWithType<TButton>()
)(({
  id,
  accessibilityLabel,
  isDisabled,
  children,
  onPress,
  onPressIn,
  onPressOut,
}) => (
  <TouchableWithoutFeedback
    testID={id}
    accessibilityLabel={accessibilityLabel}
    disabled={isDisabled}
    hitSlop={hitSlop}
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
  >
    <SizeParentBlock>
      {children}
    </SizeParentBlock>
  </TouchableWithoutFeedback>
))

Button.displayName = 'Button'
Button.componentSymbol = SYMBOL_BUTTON
