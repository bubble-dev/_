import React, { FC } from 'react'
import { startWithType, pureComponent, mapWithPropsMemo } from 'refun'
import { TAnyObject } from 'tsfn'
import { SYMBOL_SOURCE_IMPORTS } from '../../symbols'
import { Scroll } from '../scroll'
import { LinesBlock } from './LinesBlock'
import { serializeImportsLines } from './serialize-imports-lines'

export type TSourceImports = {
  Component: FC<any>,
  componentProps: Readonly<TAnyObject>,
  importPackageName: string,
}

export const SourceImports = pureComponent(
  startWithType<TSourceImports>(),
  mapWithPropsMemo(({ Component, componentProps, importPackageName }) => ({
    lines: serializeImportsLines(Component, componentProps, importPackageName),
  }), ['Component', 'componentProps', 'importPackageName'])
)(({ lines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically>
    <LinesBlock lines={lines}/>
  </Scroll>
))

SourceImports.displayName = 'SourceImports'
SourceImports.componentSymbol = SYMBOL_SOURCE_IMPORTS
