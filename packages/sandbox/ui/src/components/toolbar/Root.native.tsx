import { TComponent } from 'refun'
import { SYMBOL_TOOLBAR } from '../../symbols'
import { TToolbar } from './types'

export const Toolbar: TComponent<TToolbar> = () => null

Toolbar.displayName = 'Toolbar'
Toolbar.componentSymbol = SYMBOL_TOOLBAR
