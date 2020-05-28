import React from 'react'
import { TouchableWithoutFeedback as Touchable, View } from 'react-native'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { normalizeNativeStyle } from 'stili'
import { TRadioInput } from './types'
import { RadioContext } from './context'

const styles = normalizeNativeStyle({
  flexGrow: 1,
  flexShrink: 1,
  alignSelf: 'stretch',
  minWidth: 0,
  justifyContent: 'space-between',
})

const VisibleRadio = ({ isChecked }: { isChecked: boolean}) => (
  <View style={{
    ...styles,
    width: 10,
    height: 10,
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <View style={{
      opacity: isChecked ? 1 : 0,
      width: 2,
      height: 2,
      backgroundColor: '#000',
      borderRadius: 50,
      flexGrow: 0,
    }}
    />
  </View>
)

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapContext(RadioContext),
  mapDefaultProps({
    isDisabled: false,
  })
)(({
  isVisible,
  groupName,
  accessibilityLabel,
  id,
  groupValue,
  setGroupValue,
  value,
  isDisabled,
  ...props
}) => (
  <Touchable
    testID={`${groupName}-${id}`}
    accessibilityLabel={accessibilityLabel}
    onPress={() => (isDisabled ? null : setGroupValue(value))}
  >
    <View>
      {props.children}
      {isVisible && <VisibleRadio isChecked={groupValue === value}/> }
    </View>
  </Touchable>
))

RadioInput.displayName = 'RadioInput'

