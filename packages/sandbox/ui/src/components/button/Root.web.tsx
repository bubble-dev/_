import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import { SYMBOL_BUTTON } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'
import { TButton } from './types'

export const Button = component(
  startWithType<TButton>(),
  mapWithPropsMemo(({ isDisabled }) => ({
    styles: normalizeStyle({
      display: 'flex',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      appearance: 'none',
      background: 'none',
      border: 0,
      cursor: isDisabled ? 'auto' : 'pointer',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      outline: 0,
      tapHighlightColor: 'rgba(255, 255, 255, 0)',
      userSelect: 'none',
      textAlign: 'initial',
    }),
  }), ['isDisabled'])
)(({
  id,
  accessibilityLabel,
  isDisabled,
  styles,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
}) => (
  <SizeParentBlock>
    <button
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      id={id}
      onClick={onPress}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
      style={styles}
    >
      {children}
    </button>
  </SizeParentBlock>
))

Button.displayName = 'Button'
Button.componentSymbol = SYMBOL_BUTTON
