import React from 'react'
import { startWithType, mapHandlers, pureComponent, mapState, mapDebouncedHandlerTimeout, mapWithProps, mapProps } from 'refun'
import { Switch } from '../switch'
import { SYMBOL_SWITCH } from '../../symbols'

export type TValueCheckboxProps = {
  propPath: readonly string[],
  checkedPropValue: any,
  propValue: any,
  propPossibleValues: readonly any[],
  onChange: (propPath: readonly string[], propValue: any) => void,
}

const isDefined = (val: any): boolean => val !== false && val !== undefined

const ableToShowFalseValue = (propPossibleValues: readonly any[]): boolean => propPossibleValues.length === 2 && propPossibleValues.includes(true) && propPossibleValues.includes(false)

export const ValueCheckbox = pureComponent(
  startWithType<TValueCheckboxProps>(),
  mapWithProps(({ propPossibleValues }) => ({
    shouldShowFalseValue: ableToShowFalseValue(propPossibleValues),
  })),
  mapProps(({ shouldShowFalseValue, propValue }) => ({
    propValue: shouldShowFalseValue && propValue === undefined ? true : propValue,
  })),
  mapState('isChecked', 'setIsChecked', ({ propValue }) => isDefined(propValue), ['propValue']),
  mapHandlers({
    onOptimisticWait: ({ propValue, isChecked, setIsChecked }) => () => {
      const validState = isDefined(propValue)

      if (validState !== isChecked) {
        setIsChecked(validState)
      }
    },
  }),
  mapDebouncedHandlerTimeout('onOptimisticWait', 500),
  mapHandlers({
    onChange: ({ propPath, checkedPropValue, onChange, isChecked, setIsChecked, onOptimisticWait, shouldShowFalseValue }) => () => {
      setIsChecked(!isChecked)
      onOptimisticWait()
      onChange(propPath, isChecked ? shouldShowFalseValue? false : undefined : checkedPropValue)
    },
  })
)(({ isChecked, onChange }) => (
  <Switch
    isChecked={isChecked}
    onToggle={onChange}
  />
))

ValueCheckbox.displayName = 'ValueCheckbox'
ValueCheckbox.componentSymbol = SYMBOL_SWITCH
