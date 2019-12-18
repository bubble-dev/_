import React from 'react'
import { component, startWithType, mapContext, onChange } from 'refun'
import { isFunction } from 'tsfn'
import { Block } from '../block'
import { LayoutContext } from '../layout-context'
import { Size } from '../size'
import { Text } from './Text'

const LINE_HEIGHT = 20
const LINE_PADDING_LEFT = 50
const LINE_PADDING_RIGHT = 30

export type TLine = {
  index: number,
  lineWidth: number,
  children: string,
}

export const Line = component(
  startWithType<TLine>(),
  mapContext(LayoutContext),
  onChange(({ _height, _onHeightChange }) => {
    if (_height !== LINE_HEIGHT && isFunction(_onHeightChange)) {
      _onHeightChange(LINE_HEIGHT)
    }
  }, ['_height'])
)(({
  _left,
  _top,
  _width,
  _onWidthChange,
  lineWidth,
  index,
  children,
}) => (
  <Block left={_left} top={_top} width={lineWidth + LINE_PADDING_LEFT + LINE_PADDING_RIGHT} height={LINE_HEIGHT}>
    <Block left={20}>
      <Text>
        {String(index + 1).padStart(2, '0')}
      </Text>
    </Block>
    <Size left={LINE_PADDING_LEFT} width={_width} onWidthChange={_onWidthChange}>
      <Text>
        {children}
      </Text>
    </Size>
  </Block>
))

Line.displayName = 'Line'
Line.componentSymbol = Symbol('SOURCE_LINE')
