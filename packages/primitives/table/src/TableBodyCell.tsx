import React, { ReactNode } from 'react'
import { startWithType, component } from 'refun'

export type TTableBodyCell = {
  id?: string,
  children?: ReactNode,
  borderColor?: string,
  backgroundColor?: string,
}

export const TableBodyCell = component(
  startWithType<TTableBodyCell>()
)(({ id, borderColor, backgroundColor, children }) => (
  <td
    id={id}
    style={{
      margin: 0,
      padding: 0,
      backgroundColor,
      ...(borderColor && { borderTopColor: borderColor, borderTopWidth: '1px', borderTopStyle: 'solid' }),
    }}
  >
    {children}
  </td>
))

TableBodyCell.displayName = 'TableBodyCell'
