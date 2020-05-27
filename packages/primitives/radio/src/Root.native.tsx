import React from 'react'
import { TouchableWithoutFeedback as Touchable, View } from 'react-native'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { normalizeNativeStyle } from 'stili'
import { TRadioInput, TRadioContext } from './types'
import { RadioContext } from './context'

const styles = normalizeNativeStyle({
  flexGrow: 1,
  flexShrink: 1,
  alignSelf: 'stretch',
  minWidth: 0,
  justifyContent: 'space-between',
})

const VisibleRadio = component(
  startWithType<TRadioInput & TRadioContext>(),
  mapContext(RadioContext)
)(({ groupName, id, accessibilityLabel, setGroupValue: onChange, groupValue, value, isDisabled }) => {
  console.log('groupValue', groupValue)
  console.log('Value', value)

  return (
    <Touchable
      style={styles}
      testID={`${groupName}-${id}`}
      accessibilityLabel={accessibilityLabel}
      onPress={() => (isDisabled ? null : onChange(value))}
      onBlur={() => {
        console.log('blurred')
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
  )
})

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapContext(RadioContext),
  mapDefaultProps({
    isDisabled: false,
  }),
  mapContext(RadioContext)
)(({
  isVisible,
  groupValue,
  setGroupValue,
  ...props
}) => {
  return (
    <>
      {props.children}
      {isVisible && <VisibleRadio {...props} groupValue={groupValue} setGroupValue={setGroupValue}/> }
    </>
  )
})

RadioInput.displayName = 'RadioInput'

