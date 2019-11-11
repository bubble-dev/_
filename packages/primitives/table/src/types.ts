export type TTableBorderStyle = {
  borderColor?: string,
  borderTopWidth?: number,
  borderBottomWidth?: number,
  borderLeftWidth?: number,
  borderRightWidth?: number,
  borderStyle?: 'solid' | 'dotted' | 'dashed' | 'none',
}

export type TTableBorderStyleNative = {
  borderColor?: string,
  borderTopWidth?: number,
  borderBottomWidth?: number,
  borderLeftWidth?: number,
  borderRightWidth?: number,
  borderStyle?: 'solid' | 'dotted' | 'dashed',
}

export type TTableCellPosition = {
  position?: 'fixed' | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | '-webkit-sticky' | 'absolute' | 'relative' | 'static' | 'sticky',
}

