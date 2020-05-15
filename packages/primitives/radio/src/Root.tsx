import React from 'react'
import { normalizeWebStyle } from 'stili'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { TRadioInput, TCallbackEvent } from './types'
import { RadioContext } from './context'

const execCb = (cb: any, evt: TCallbackEvent) => {
  if (typeof cb === 'function') {
    cb(evt)
  }
}

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
  onChange,
  onBlur,
  onFocus,
  onPress,
  isVisible,
}) => (
  <label htmlFor={id}>
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
      onChange={(evt) => {
        setGroupValue(evt.currentTarget.value)
        execCb(onChange, evt)
      }}
      onBlur={(evt) => {
        execCb(onBlur, evt)
      }}
      onFocus={(evt) => {
        execCb(onFocus, evt)
      }}
      onClick={(evt) => {
        execCb(onPress, evt)
      }}
    />
  </label>
))

RadioInput.displayName = 'RadioInput'
