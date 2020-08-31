import React from 'react'
import type { FC } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import type { TPrimitiveButton } from './types'

const hitSlop = {
  bottom: 5,
  left: 5,
  right: 5,
  top: 5,
}

const style: ViewStyle = {
  flexDirection: 'row',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

export const PrimitiveButton: FC<TPrimitiveButton> = ({
  id,
  accessibilityLabel,
  isDisabled,
  onPress,
  onPressIn,
  onPressOut,
  children,
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
    <View style={style}>
      {children}
    </View>
  </TouchableWithoutFeedback>
)

PrimitiveButton.displayName = 'PrimitiveButton'
