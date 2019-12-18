import React from 'react'
import { TComponent } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconMinus: TComponent<TIcon> = () => (
  <Icon
    d="M4.8,9.3 C4.3,9.3 4.0,9.6 4.0,10.0 C4.0,10.4 4.3,10.8 4.8,10.8 L15.3,10.8 C15.7,10.8 16.0,10.4 16.0,10.0 C16.0,9.6 15.7,9.3 15.3,9.3 L4.8,9.3 Z"
  />
)

IconMinus.displayName = 'IconMinus'
IconMinus.componentSymbol = SYMBOL_ICON
