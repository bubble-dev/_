import React from 'react'
import { TComponent } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { TIcon } from './types'

export const IconCopy: TComponent<TIcon> = () => (
  <Icon
    d="M14.5,12.2 L14.5,13.7 C14.5,14.2 14.2,14.5 13.8,14.5 L6.3,14.5 C5.8,14.5 5.5,14.2 5.5,13.7 L5.5,12.2 C5.5,11.8 5.2,11.5 4.8,11.5 C4.3,11.5 4.0,11.8 4.0,12.2 L4.0,13.7 C4.0,15.0 5.0,16.0 6.3,16.0 L13.8,16.0 C15.0,16.0 16.0,15.0 16.0,13.7 L16.0,12.2 C16.0,11.8 15.7,11.5 15.3,11.5 C14.8,11.5 14.5,11.8 14.5,12.2 Z M6.3,8.8 L9.2,5.9 L9.2,11.7 C9.2,12.2 9.6,12.5 10.0,12.5 C10.4,12.5 10.7,12.2 10.7,11.7 L10.7,5.9 L13.7,8.8 C13.9,8.9 14.1,9.0 14.2,9.0 C14.4,9.0 14.6,8.9 14.8,8.8 C15.1,8.5 15.1,8.0 14.8,7.7 L11.6,4.6 C10.7,3.8 9.3,3.8 8.4,4.6 L5.2,7.7 C4.9,8.0 4.9,8.5 5.2,8.8 C5.5,9.1 6.0,9.1 6.3,8.8"
  />
)

IconCopy.displayName = 'IconCopy'
IconCopy.componentSymbol = SYMBOL_ICON
