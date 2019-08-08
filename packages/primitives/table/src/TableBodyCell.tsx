import React, { ReactNode } from 'react'
import { normalizeStyle } from 'stili'
import { startWithType, component, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { TTableBorderStyle } from './types'

export type TTableBodyCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
} & TTableBorderStyle

export const TableBodyCell = component(
  startWithType<TTableBodyCell>(),
  mapDefaultProps({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  }),
  mapWithPropsMemo(({ borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, borderStyle, borderColor, backgroundColor }) => ({
    style: normalizeStyle({
      padding: 0,
      borderColor,
      backgroundColor,
      borderTopWidth: `${borderTopWidth}px`,
      borderBottomWidth: `${borderBottomWidth}px`,
      borderLeftWidth: `${borderLeftWidth}px`,
      borderRightWidth: `${borderRightWidth}px`,
      borderStyle,
    }),
  }), ['borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth', 'borderStyle', 'borderColor', 'backgroundColor'])
)(({ id, style, children }) => (
  <td id={id} style={style}>
    {children}
  </td>
))

TableBodyCell.displayName = 'TableBodyCell'
