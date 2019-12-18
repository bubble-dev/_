import React from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapWithPropsMemo, mapContext } from 'refun'
import { SYMBOL_CHECKBOX } from '../../symbols'
import { LayoutContext } from '../layout-context'
import { SizeParentBlock } from '../size-parent-block'
import { TCheckboxProps } from './types'

export const Checkbox = component(
  startWithType<TCheckboxProps>(),
  mapContext(LayoutContext),
  mapWithPropsMemo(({ isDisabled }) => ({
    style: normalizeStyle({
      position: 'absolute',
      appearance: 'none',
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      top: 0,
      left: 0,
      opacity: 0,
      cursor: isDisabled ? 'auto' : 'pointer',
      tapHighlightColor: 'rgba(255, 255, 255, 0)',
    }),
  }), ['isDisabled'])
)(({
  id,
  accessibilityLabel,
  isDisabled,
  isChecked,
  style,
  onToggle,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
}) => (
  <SizeParentBlock>
    {children}
    <input
      type="checkbox"
      style={style}
      checked={isChecked}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      id={id}
      onChange={onToggle}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </SizeParentBlock>
))

Checkbox.displayName = 'Checkbox'
Checkbox.componentSymbol = SYMBOL_CHECKBOX
