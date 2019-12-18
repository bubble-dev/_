import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { LayoutContext } from '../layout-context'
import { Block } from '../block'

export type TSizeParentBlock = {
  shouldIgnorePointerEvents?: boolean,
}

export const SizeParentBlock = component(
  startWithType<TSizeParentBlock>(),
  mapContext(LayoutContext)
)(({
  _x,
  _y,
  _parentLeft,
  _parentTop,
  _parentWidth,
  _parentHeight,
  _left,
  _top,
  _width,
  _height,
  _onWidthChange,
  _onHeightChange,
  _maxWidth,
  _maxHeight,
  shouldIgnorePointerEvents,
  children,
}) => (
  <Block
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    shouldIgnorePointerEvents={shouldIgnorePointerEvents}
  >
    <LayoutContext.Provider
      value={{
        _x,
        _y,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth,
        _parentHeight,
        _left: _left - _parentLeft,
        _top: _top - _parentTop,
        _width,
        _height,
        _onWidthChange,
        _onHeightChange,
        _maxWidth,
        _maxHeight,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </Block>
))

SizeParentBlock.displayName = 'SizeParentBlock'
SizeParentBlock.componentSymbol = Symbol('SIZE_PARENT_BLOCK')
