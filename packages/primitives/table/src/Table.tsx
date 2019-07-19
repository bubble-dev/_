import React, { ReactNode } from 'react'
import { startWithType, component } from 'refun'

export type TTable = {
  id?: string,
  children?: ReactNode,
  borderColor?: string,
}

export const Table = component(
  startWithType<TTable>()
)(({ id, children, borderColor }) => (
  <table
    id={id}
    style={{
      borderCollapse: 'collapse',
      width: '100%',
      margin: 0,
      padding: 0,
      borderColor,
      borderStyle: 'solid',
      borderWidth: '1px',
    }}
  >
    {children}
  </table>
))

Table.displayName = 'Table'
