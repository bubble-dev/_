import React from 'react'
import { normalizeWebStyle } from 'stili'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { TRadioInput } from './types'
import { RadioContext } from './context'

const visibleStyles = normalizeWebStyle({
  backgroundColor: 'rgba(0, 0, 0, 0)',
  borderWidth: 0,
  minWidth: 0,
  _webOnly: {
    boxSizing: 'border-box',
  },
})

const invisibleStyles = normalizeWebStyle({
  display: 'none',
})

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapDefaultProps({
    isDisabled: false,
    accessibilityLabelBy: [],
    isVisible: false,
  }),
  mapContext(RadioContext)
)(({
  id,
  children,
  groupName,
  groupValue,
  setGroupValue,
  key,
  accessibilityLabelBy,
  accessibilityLabel,
  value,
  isDisabled,
  isVisible,
}) => (
  <label>
    {children}
    <input
      type="radio"
      id={id}
      name={groupName}
      key={key || groupName + id}
      checked={groupValue === value}
      value={value}
      aria-labelledby={accessibilityLabelBy.length > 0 ? accessibilityLabelBy.join(' ') : undefined}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      style={isVisible ? visibleStyles : invisibleStyles}
      onChange={() => setGroupValue(value)}
    />
  </label>
))

RadioInput.displayName = 'RadioInput'
