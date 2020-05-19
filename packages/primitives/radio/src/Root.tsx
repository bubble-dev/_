import React from 'react'
import { normalizeWebStyle } from 'stili'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { TRadioInput } from './types'
import { RadioContext } from './context'

const styles = normalizeWebStyle({
  backgroundColor: 'rgba(0, 0, 0, 0)',
  borderWidth: 0,
  minWidth: 0,
  _webOnly: {
    boxSizing: 'border-box',
  },
})

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapDefaultProps({
    isDisabled: false,
    accessibilityLabelBy: [],
  }),
  mapContext(RadioContext)
)(({
  id,
  groupName,
  groupValue,
  setGroupValue,
  key,
  accessibilityLabelBy,
  accessibilityLabel,
  value,
  isDisabled,
  onChange,
}) => (
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
    style={styles}
    onChange={(evt) => {
      setGroupValue(evt.currentTarget.value)

      if (typeof onChange === 'function') {
        onChange(evt)
      }
    }}
  />
))

RadioInput.displayName = 'RadioInput'