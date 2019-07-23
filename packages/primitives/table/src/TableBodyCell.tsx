import React, { ReactNode } from 'react'
import { normalizeStyle } from 'stili'
import { startWithType, component, mapDefaultProps, mapWithProps } from 'refun'

export type TTableBodyCell = {
  id?: string,
  children?: ReactNode,
  borderColor?: string,
  borderTopWidth?: number,
  borderBottomWidth?: number,
  borderLeftWidth?: number,
  borderRightWidth?: number,
  backgroundColor?: string,
  borderStyle?: string,
}

export const TableBodyCell = component(
  startWithType<TTableBodyCell>(),
  mapDefaultProps({
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
  }),
  mapWithProps(({ borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth }) => ({
    style: normalizeStyle({
      borderTopWidth: `${borderTopWidth}px`,
      borderBottomWidth: `${borderBottomWidth}px`,
      borderLeftWidth: `${borderLeftWidth}px`,
      borderRightWidth: `${borderRightWidth}px`,
    }),
  }))
)(({
  id,
  borderColor,
  backgroundColor,
  borderStyle,
  borderTopWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderRightWidth,
  children,
}) => (
  <td
    id={id}
    style={{
      margin: 0,
      padding: 0,
      backgroundColor,
      ...(borderColor && {
        borderColor,
        borderStyle,
        borderTopWidth,
        borderBottomWidth,
        borderLeftWidth,
        borderRightWidth,
      }),
    }}
  >
    {children}
  </td>
))

TableBodyCell.displayName = 'TableBodyCell'
