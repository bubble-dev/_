import React from 'react'
import type { TStyle } from 'stili'
import { normalizeWebStyle } from 'stili'
import { component, startWithType, mapWithProps } from 'refun'
import type { TList } from './types'

export const List = component(
  startWithType<TList>(),
  mapWithProps(() => {
    const style: TStyle = {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    }

    return {
      style: normalizeWebStyle(style),
    }
  })
)(({ id, children, style }) => (
  <ul id={id} style={style}>{children}</ul>
))

List.displayName = 'List'
