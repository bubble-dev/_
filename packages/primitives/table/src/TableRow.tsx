import React, { ReactNode } from 'react'
import { startWithType, component } from 'refun'

export type TTableRow = {
  id?: string,
  children?: ReactNode,
}

export const TableRow = component(
  startWithType<TTableRow>()
)(({ id, children }) => (
  <tr
    id={id}
    style={{ margin: 0, padding: 0 }}
  >
    {children}
  </tr>
))

TableRow.displayName = 'TableRow'
