import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { SYMBOL_CONSOLE } from '../../symbols'
import { Scroll } from '../scroll'
import { LinesBlock } from './LinesBlock'

export type TConsole = {
  consoleLines: readonly string[],
}

export const Console = pureComponent(
  startWithType<TConsole>()
)(({ consoleLines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically>
    <LinesBlock lines={consoleLines}/>
  </Scroll>
))

Console.displayName = 'Console'
Console.componentSymbol = SYMBOL_CONSOLE
