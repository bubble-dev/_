import React, { FC } from 'react'
import { serializeComponent } from 'syntx'
import { startWithType, pureComponent, mapWithPropsMemo } from 'refun'
import { TAnyObject } from 'tsfn'
import { TComponentConfig } from 'autoprops'
import { SYMBOL_SOURCE_CODE } from '../../symbols'
import { Scroll } from '../scroll'
import { LinesBlock } from './LinesBlock'
import { createChildrenMeta } from './create-children-meta'

export type TSourceCode = {
  Component: FC<any>,
  componentConfig: TComponentConfig,
  componentProps: Readonly<TAnyObject>,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  copyImportPackageName?: string,
}

export const SourceCode = pureComponent(
  startWithType<TSourceCode>(),
  mapWithPropsMemo(({ Component, componentConfig, componentProps, componentPropsChildrenMap }) => ({
    lines: serializeComponent(Component, componentProps, {
      indent: 2,
      meta: createChildrenMeta(componentConfig, componentPropsChildrenMap),
    }),
  }), ['Component', 'componentProps', 'componentPropsChildrenMap'])
)(({ lines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically>
    <LinesBlock lines={lines}/>
  </Scroll>
))

SourceCode.displayName = 'SourceCode'
SourceCode.componentSymbol = SYMBOL_SOURCE_CODE
