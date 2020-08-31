import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconDarkMode = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.darkMode}
    orientation={orientation}
  />
))

IconDarkMode.displayName = 'IconDarkMode'
IconDarkMode.componentSymbol = SYMBOL_ICON
