import React from 'react'
import { startWithType, component } from 'refun'
import { TStyle } from 'stili'
import { SYMBOL_LABEL } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'

const style: TStyle = {
  userSelect: 'none',
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}

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
