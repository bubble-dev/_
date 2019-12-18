import React from 'react'
import { TComponent } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconArrowUp: TComponent<TIcon> = () => (
  <Icon
    d="M0,10 10,0 20,10Z"
  />
)

IconArrowUp.displayName = 'IconArrowUp'
IconArrowUp.componentSymbol = SYMBOL_ICON
