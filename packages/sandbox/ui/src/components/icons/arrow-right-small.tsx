import React from 'react'
import { TComponent } from 'refun'
import { IconSmall } from '../icon-small'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconArrowRight: TComponent<TIcon> = () => (
  <IconSmall
    d="M6,0 12,6 6,12Z"
  />
)

IconArrowRight.displayName = 'IconArrowRightSmall'
IconArrowRight.componentSymbol = SYMBOL_ICON
