import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { TRadioInput } from './types'

export const RadioInput = component(
  startWithType<TRadioInput>(),
  mapHandlers({
    onChange: ({ onChange, id, value }) => (event: any) => onChange(id, value, event),
  }),
  mapWithProps(
    () => {
      const style: TStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 0,
        boxSizing: 'border-box',
        maxWidth: '100%',
        minWidth: 0,
      }

      return {
        style: normalizeStyle(style),
      }
    }
  )
)(({
  id,
  groupValue,
  groupName,
  key,
  accessibilityLabelBy = [],
  accessibilityLabel,
  style,
  value,
  isDisabled,
  onChange,
}) => {
  const isChecked = groupValue === value

  return (
    <input
      type="radio"
      id={id}
      name={groupName}
      key={key || groupName + id}
      checked={isChecked}
      value={value}
      aria-labelledby={accessibilityLabelBy.length > 0 ? accessibilityLabelBy.join(' ') : undefined}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      style={style}
      onChange={onChange}
    />
  )
})

RadioInput.displayName = 'RadioInput'
