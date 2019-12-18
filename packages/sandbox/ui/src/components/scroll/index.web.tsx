import React, { ReactNode } from 'react'
import { component, startWithType, mapContext, mapState, onChange, mapWithProps, mapDefaultProps, mapWithPropsMemo } from 'refun'
import { isFunction } from 'tsfn'
import { TStyle, normalizeStyle } from 'stili'
import { LayoutContext } from '../layout-context'
import { Block } from '../block'
import { SYMBOL_SCROLL } from '../../symbols'

export type TScroll = {
  shouldScrollHorizontally?: boolean,
  shouldScrollVertically?: boolean,
  children: ReactNode,
}

export const Scroll = component(
  startWithType<TScroll>(),
  mapDefaultProps({
    shouldScrollHorizontally: false,
    shouldScrollVertically: false,
  }),
  mapContext(LayoutContext),
  onChange(({ shouldScrollHorizontally, shouldScrollVertically, _onWidthChange, _onHeightChange }) => {
    if ((isFunction(_onWidthChange) && shouldScrollHorizontally) || (isFunction(_onHeightChange) && shouldScrollVertically)) {
      throw new Error('Scroll works only with explicit sizes')
    }
  }, ['_onWidthChange', '_onHeightChange']),
  mapState('contentWidth', 'setContentWidth', () => 0, []),
  mapState('contentHeight', 'setContentHeight', () => 0, []),
  mapWithProps(({ _width, contentWidth, setContentWidth, shouldScrollHorizontally }) => {
    if (shouldScrollHorizontally) {
      return {
        contentWidth,
        onWidthChange: setContentWidth,
      }
    }

    return {
      contentWidth: _width,
    }
  }),
  mapWithProps(({ _height, contentHeight, setContentHeight, shouldScrollVertically }) => {
    if (shouldScrollVertically) {
      return {
        contentHeight,
        onHeightChange: setContentHeight,
      }
    }

    return {
      contentHeight: _height,
    }
  }),
  mapWithPropsMemo(({ _left, _top, _width, _height, shouldScrollHorizontally, shouldScrollVertically }) => {
    const style: TStyle = {
      display: 'flex',
      position: 'absolute',
      left: _left,
      top: _top,
      width: _width,
      height: _height,
      overflowX: 'hidden',
      overflowY: 'hidden',
    }

    if (shouldScrollHorizontally) {
      style.overflowX = 'scroll'
    }

    if (shouldScrollVertically) {
      style.overflowY = 'scroll'
    }

    return {
      style: normalizeStyle(style),
    }
  }, ['shouldScrollHorizontally', 'shouldScrollVertically', '_left', '_top', '_width', '_height'])
)(({
  _x,
  _y,
  _width,
  _height,
  contentWidth,
  contentHeight,
  onWidthChange,
  onHeightChange,
  style,
  children,
}) => (
  <div style={style}>
    <Block width={contentWidth} height={contentHeight} shouldFlow/>
    <LayoutContext.Provider
      value={{
        _x,
        _y,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth: _width,
        _parentHeight: _height,
        _left: 0,
        _top: 0,
        _width: contentWidth,
        _height: contentHeight,
        _onWidthChange: onWidthChange,
        _onHeightChange: onHeightChange,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </div>
))

Scroll.displayName = 'Scroll'
Scroll.componentSymbol = SYMBOL_SCROLL
