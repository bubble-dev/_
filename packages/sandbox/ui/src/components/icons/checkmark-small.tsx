import React from 'react'
import { TComponent } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { IconSmall } from '../icon-small'
import { TIcon } from './types'

export const IconCheckmarkSmall: TComponent<TIcon> = () => (
  <IconSmall
    d="M10.215 1L4.292 8.558 1.414 5.68 0 7.094l3.676 3.676a1 1 0 00.707.293l.06-.002c.286-.018.55-.157.727-.381l6.619-8.446L10.215 1z"
  />
)

IconCheckmarkSmall.displayName = 'IconCheckmarkSmall'
IconCheckmarkSmall.componentSymbol = SYMBOL_ICON
