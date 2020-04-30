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

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapDefaultProps({
    isDisabled: false,
  }),
  mapContext(RadioContext)
)(({
  groupName,
  id,
  accessibilityLabel,
  isDisabled,
  onChange,
  value,
  groupValue,
  setGroupValue,
}) => (
  <Touchable
    style={styles}
    testID={`${groupName}-${id}`}
    accessibilityLabel={accessibilityLabel}
    onPress={(evt) => {
      if (isDisabled) {
        return false
      }

      setGroupValue(value)

      if (typeof onChange === 'function') {
        onChange(evt)
      }
    }}
  >
    <View style={{
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
        opacity: groupValue === value ? 1 : 0,
        width: 2,
        height: 2,
        backgroundColor: '#000',
        borderRadius: 50,
        flexGrow: 0,
      }}
      />
    </View>
  </Touchable>
))

RadioInput.displayName = 'RadioInput'

