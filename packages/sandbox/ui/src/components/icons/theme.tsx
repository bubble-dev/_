import React from 'react'
import { TComponent } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconTheme: TComponent<TIcon> = () => (
  <Icon
    d="M5.5,10 C5.5,7.519 7.519,5.5 10,5.5 L10,14.5 C7.519,14.5 5.5,12.481 5.5,10 M10,4 C6.691,4 4,6.691 4,10 C4,13.309 6.691,16 10,16 C13.309,16 16,13.309 16,10 C16,6.691 13.309,4 10,4"
  />
)

IconTheme.displayName = 'IconTheme'
IconTheme.componentSymbol = SYMBOL_ICON
