import React, { ReactNode } from 'react'
import { component, startWithType, mapContext, mapState, mapDefaultProps, onLayout, mapHandlers, mapWithProps, mapRef } from 'refun'
import { isNumber } from 'tsfn'
import { TStyle, normalizeWebStyle } from 'stili'
import { LayoutContext } from '../layout-context'
import { SYMBOL_SCROLL } from '../../symbols'

export type TScroll = {
  shouldScrollHorizontally?: boolean,
  shouldScrollVertically?: boolean,
  shouldScrollToBottom?: boolean,
  children: ReactNode,
}

export const Scroll = component(
  startWithType<TScroll>(),
  mapDefaultProps({
    shouldScrollHorizontally: false,
    shouldScrollVertically: false,
    shouldScrollToBottom: false,
  }),
  mapContext(LayoutContext),
  mapState('contentWidth', 'onContentWidthChange', () => 0, []),
  mapState('contentHeight', 'onContentHeightChange', () => 0, []),
  mapHandlers({
    onWidthChange: ({ onContentWidthChange, _maxWidth, _onWidthChange }) => (value: number) => {
      onContentWidthChange(value)
      _onWidthChange?.(isNumber(_maxWidth) && _maxWidth > 0 ? Math.min(_maxWidth, value) : value)
    },
    onHeightChange: ({ onContentHeightChange, _maxHeight, _onHeightChange }) => (value: number) => {
      onContentHeightChange(value)
      _onHeightChange?.(isNumber(_maxHeight) && _maxHeight > 0 ? Math.min(_maxHeight, value) : value)
    },
  }),
  mapWithProps(({ _left, _top, _width, _height, contentWidth, contentHeight, shouldScrollHorizontally, shouldScrollVertically }) => {
    const wrapperStyle: TStyle = {
      _webOnly: {
        overflowX: 'hidden',
        overflowY: 'hidden',
      },
      display: 'flex',
      position: 'absolute',
      left: _left,
      top: _top,
      width: _width,
      height: _height,
    }
    const childStyle: TStyle = {
      width: contentWidth,
      height: contentHeight,
    }

    if (shouldScrollHorizontally) {
      wrapperStyle._webOnly!.overflowX = 'scroll'
    }

    if (shouldScrollVertically) {
      wrapperStyle._webOnly!.overflowY = 'scroll'
    }

    return {
      wrapperStyle: normalizeWebStyle(wrapperStyle),
      childStyle: normalizeWebStyle(childStyle),
    }
  }),
  mapRef('ref', null as null | HTMLDivElement),
  onLayout(({ ref, shouldScrollToBottom }) => {
    if (ref.current !== null && shouldScrollToBottom) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, ['shouldScrollToBottom'])
)(({
  _x,
  _y,
  _width,
  _height,
  contentWidth,
  contentHeight,
  onWidthChange,
  onHeightChange,
  wrapperStyle,
  childStyle,
  shouldScrollHorizontally,
  shouldScrollVertically,
  children,
  ref,
}) => (
  <div ref={ref} style={wrapperStyle}>
    <div style={childStyle}/>
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
        _width: shouldScrollHorizontally ? contentWidth : _width,
        _height: shouldScrollVertically ? contentHeight : _height,
        _onWidthChange: shouldScrollHorizontally ? onWidthChange : undefined,
        _onHeightChange: shouldScrollVertically ? onHeightChange : undefined,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </div>
))

Scroll.displayName = 'Scroll'
Scroll.componentSymbol = SYMBOL_SCROLL
