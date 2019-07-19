import React, { ReactNode } from 'react'
import { startWithType, component } from 'refun'

export type TTableHeadCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
}

export const TableHeadCell = component(
  startWithType<TTableHeadCell>()
)(({ id, children, backgroundColor }) => (
  <th
    id={id}
    style={{
      margin: 0,
      padding: 0,
      backgroundColor,
    }}
  >
    {children}
  </th>
))

TableHeadCell.displayName = 'TableHeadCell'
