import React from 'react'
import { TouchableWithoutFeedback as Touchable, View } from 'react-native'
import { component, mapWithProps, startWithType } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { TRadioInput } from './types'
import { RadioContext } from './context'

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapWithProps(
    () => {
      const style: TStyle = {
        flexGrow: 1,
        flexShrink: 1,
        alignSelf: 'stretch',
        minWidth: 0,
        justifyContent: 'space-between',
      }

      return {
        style: normalizeStyle(style),
      }
    }
  )
)(({
  groupName,
  id,
  accessibilityLabel,
  style,
  isDisabled,
  onChange,
  value,
}) => (
  <RadioContext.Consumer>
    {([groupValue, setGroupValue]) => (
      <Touchable
        style={style}
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
    )}
  </RadioContext.Consumer>
))

RadioInput.displayName = 'RadioInput'

