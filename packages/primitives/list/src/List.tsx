import React from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import type { TList } from './types'

export const List = component(
  startWithType<TList>(),
  mapWithProps(() => {
    const style = {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    }

    return {
      style,
    }
  })
)(({ id, children, style }) => (
  <ul id={id} style={style}>{children}</ul>
))

List.displayName = 'List'
