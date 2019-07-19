import React, { ReactNode } from 'react'
import { startWithType, component } from 'refun'

export type TTableHead = {
  id?: string,
  children?: ReactNode,
}

export const TableHead = component(
  startWithType<TTableHead>()
)(({ id, children }) => (
  <thead
    id={id}
    style={{ margin: 0, padding: 0 }}
  >
    {children}
  </thead>
))

TableHead.displayName = 'TableHead'
