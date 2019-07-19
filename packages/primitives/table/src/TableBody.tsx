import React, { ReactNode } from 'react'
import { startWithType, component } from 'refun'

export type TTableBody = {
  id?: string,
  children?: ReactNode,
}

export const TableBody = component(
  startWithType<TTableBody>()
)(({ id, children }) => (
  <tbody
    id={id}
    style={{
      margin: 0,
      padding: 0,
    }}
  >
    {children}
  </tbody>
))

TableBody.displayName = 'TableBody'
