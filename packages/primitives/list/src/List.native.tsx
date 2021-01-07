import React from 'react'
import { component, startWithType } from 'refun'
import { View } from 'react-native'
import type { TList } from './types'

export const List = component(
  startWithType<TList>()
)(({ children, id }) => (
  <View
    testID={id}
  >
    {children}
  </View>
))

List.displayName = 'List'
