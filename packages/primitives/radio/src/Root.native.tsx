import React from 'react'
import { TouchableWithoutFeedback as Touchable, View } from 'react-native'
import { component, startWithType, mapContext, mapDefaultProps, mapHandlers } from 'refun'
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
  mapHandlers({
    onPress: ({ isDisabled, setGroupValue, value }) => () => (isDisabled ? undefined : setGroupValue(value)),
  }),
  mapDefaultProps({
    isDisabled: false,
  })
)(({
  children,
  onPress,
  isVisible,
  groupName,
  accessibilityLabel,
  id,
  value,
  groupValue,
}) => {
  const isChecked = groupValue === value

  return (
    <Touchable
      testID={`${groupName}-${id}`}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      <View>
        {children}
        {isVisible && <VisibleRadio isChecked={isChecked}/> }
      </View>
    </Touchable>
  )
})

RadioInput.displayName = 'RadioInput'

