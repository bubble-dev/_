import React from 'react'
import { Text, Linking, TouchableWithoutFeedback } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import { isFunction } from 'tsfn'
import { TLink } from './types'

export const Link = component(
  startWithType<TLink>(),
  mapHandlers({
    onPress: ({ href, onPress }) => async () => {
      if (isFunction(onPress)) {
        onPress()
      }

      if (typeof href === 'string') {
        const isSupported = await Linking.canOpenURL(href)

        if (isSupported) {
          await Linking.openURL(href)
        }
      }
    },
  })
)(({ children, id, onPress }) => {
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <Text testID={id} onPress={onPress} accessibilityRole="link">
        {children}
      </Text>
    )
  }

  return (
    <TouchableWithoutFeedback testID={id} onPress={onPress} accessibilityRole="link">
      {children}
    </TouchableWithoutFeedback>
  )
})

Link.displayName = 'Link'
