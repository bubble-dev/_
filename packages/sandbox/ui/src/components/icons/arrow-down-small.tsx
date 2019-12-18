import React from 'react'
import { TComponent } from 'refun'
import { IconSmall } from '../icon-small'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconArrowDownSmall: TComponent<TIcon> = () => (
  <IconSmall
    d="M1,3 6,10 11,3Z"
  />
)

IconArrowDownSmall.displayName = 'IconArrowDownSmall'
IconArrowDownSmall.componentSymbol = SYMBOL_ICON
