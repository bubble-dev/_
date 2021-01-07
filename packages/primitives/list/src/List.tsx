import React from 'react'
import { component, startWithType } from 'refun'
import type { TList } from './types'

export const List = component(
  startWithType<TList>()
)(({ id, children }) => (
  <ul id={id}>{children}</ul>
))

List.displayName = 'List'
