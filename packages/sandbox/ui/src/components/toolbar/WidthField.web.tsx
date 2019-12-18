import React from 'react'
import { mapState, mapHandlers, pureComponent, startWithType } from 'refun'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setWidth } from '../../actions'
import { FieldLight } from '../field-light'
import { SYMBOL_FIELD } from '../../symbols'

export type TWidthField = {}

export const WidthField = pureComponent(
  startWithType<TWidthField>(),
  mapStoreState(({ width }) => ({ canvasWidth: width }), ['width']),
  mapStoreDispatch,
  mapState('value', 'setValue', ({ canvasWidth }) => String(canvasWidth), ['canvasWidth']),
  mapHandlers({
    submitValue: ({ value, dispatch }) => () => dispatch(setWidth(Number(value))),
  })
)(({
  value,
  setValue,
  submitValue,
}) => (
  <FieldLight
    suffix="px"
    value={value}
    onChange={setValue}
    onSubmit={submitValue}
  />
))

WidthField.displayName = 'WidthField'
WidthField.componentSymbol = SYMBOL_FIELD
