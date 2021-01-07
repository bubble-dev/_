import React from 'react'
import { component, startWithType } from 'refun'
import { View } from 'react-native'
import type { TListItem } from './types'

export const ListItem = component(
  startWithType<TListItem>()
)(({ children, id }) => (
  <View
    testID={id}
  >
    {children}
  </View>
))

ListItem.displayName = 'ListItem'
