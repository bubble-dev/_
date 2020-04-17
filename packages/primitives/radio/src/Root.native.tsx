import React from 'react'
import { TouchableWithoutFeedback as Touchable, View } from 'react-native'
import { component, mapWithProps, startWithType, mapHandlers, mapDefaultProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { TRadioInput } from './types'

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapDefaultProps({
    paddingTop: 0,
    paddingBottom: 0,
  }),
  mapHandlers({
    onChange: ({ onChange, id, value }) => () => onChange(id, value),
  }),
  mapWithProps(
    () => {
      const style: TStyle = {
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        flexGrow: 1,
        flexShrink: 1,
        alignSelf: 'stretch',
        minWidth: 0,
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
  groupValue,
}) => {
  const isChecked = groupValue === value

  return (
    <Touchable
      testID={`${groupName}-${id}`}
      accessibilityLabel={accessibilityLabel}
      style={style}
      onPress={() => {
        if (isDisabled) {
          return false
        }

        onChange(id, value)
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
          opacity: isChecked ? 1 : 0,
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

RadioInput.displayName = 'RadioInput'

