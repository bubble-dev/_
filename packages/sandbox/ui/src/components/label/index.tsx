import React from 'react'
import { startWithType, component } from 'refun'
import { normalizeWebStyle } from 'stili'
import { SYMBOL_LABEL } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'

const style = normalizeWebStyle({
  _webOnly: {
    display: 'block',
    userSelect: 'none',
  },
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
})

export type TLabel = {}

export const Label = component(
  startWithType<TLabel>()
)(({ children }) => (
  <SizeParentBlock>
    <label style={style}>
      {children}
    </label>
  </SizeParentBlock>
))

Label.displayName = 'Label'
Label.componentSymbol = SYMBOL_LABEL
