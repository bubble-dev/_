import React from 'react'
import { TComponent } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconArrowDown: TComponent<TIcon> = () => (
  <Icon
    d="M0,10 10,20 20,10Z"
  />
)

IconArrowDown.displayName = 'IconArrowDown'
IconArrowDown.componentSymbol = SYMBOL_ICON
