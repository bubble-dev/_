import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, mapWithProps, startWithType } from 'refun'
import { TRadioInput } from './types'
import { RadioContext } from './context'

export const RadioInput = component(
  startWithType<TRadioInput>(),
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
  groupName,
  key,
  accessibilityLabelBy = [],
  accessibilityLabel,
  style,
  value,
  isDisabled,
  onChange,
}) => (
  <RadioContext.Consumer>
    {([groupValue, setGroupValue]) => (
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
        style={style}
        onChange={(evt) => {
          setGroupValue(evt.currentTarget.value)

          if (typeof onChange === 'function') {
            onChange(evt)
          }
        }}
      />
    )}
  </RadioContext.Consumer>
))

RadioInput.displayName = 'RadioInput'
