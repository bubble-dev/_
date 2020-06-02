import React from 'react'
import { TouchableWithoutFeedback as Touchable, View } from 'react-native'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { normalizeNativeStyle } from 'stili'
import { TRadioInput } from './types'
import { RadioContext } from './context'

const visibleWrapperStyles = normalizeNativeStyle({
  flexGrow: 1,
  flexShrink: 1,
  alignSelf: 'stretch',
  minWidth: 0,
  width: 10,
  height: 10,
  borderColor: '#000',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
})

const visibleBullet = normalizeNativeStyle({
  width: 2,
  height: 2,
  backgroundColor: '#000',
  borderRadius: 50,
  flexGrow: 0,
})

const VisibleRadio = ({ isChecked }: { isChecked: boolean}) => (
  <View style={visibleWrapperStyles}>
    {isChecked && <View style={visibleBullet}/>}
  </View>
)

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapContext(RadioContext),
  mapDefaultProps({
    isDisabled: false,
  })
)(({
  children,
  isVisible,
  groupName,
  accessibilityLabel,
  id,
  groupValue,
  setGroupValue,
  value,
  isDisabled,
}) => (
  <Touchable
    testID={`${groupName}-${id}`}
    accessibilityLabel={accessibilityLabel}
    onPress={() => (isDisabled ? null : setGroupValue(value))}
  >
    <View>
      {children}
      {isVisible && <VisibleRadio isChecked={groupValue === value}/> }
    </View>
  </Touchable>
))

RadioInput.displayName = 'RadioInput'

