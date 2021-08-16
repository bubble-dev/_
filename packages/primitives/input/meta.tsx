import type { TComponentConfig } from 'autoprops'
import { component, startWithType, mapState, mapHandlers } from 'refun'
import type { TComponentControls } from '@revert/sandbox'
import { SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import { Input } from './src'
import type { TInput } from './src'

export const Component = component(
  startWithType<TInput>(),
  mapState('value', 'setValue', ({ value }) => value, ['value']),
  mapHandlers({
    onChange: ({ onChange, setValue }) => (value: string) => {
      setValue(value)
      onChange(value)
    },
  })
)(Input)

Component.displayName = 'Input'

export const config: TComponentConfig<TInput> = {
  props: {
    blockEnd: [10],
    blockStart: [10],
    color: [[0xff, 0x00, 0x00, 1]],
    fontFamily: ['Arial'],
    fontSize: [24],
    fontWeight: [700],
    inlineEnd: [10],
    inlineStart: [10],
    isDisabled: [true],
    letterSpacing: [5],
    lineHeight: [24],
    onChange: [() => {}],
    shouldUseNumberKeyboard: [true],
    value: ['value'],
  },
  required: ['value', 'onChange'],
  deps: {
    inlineStart: ['inlineEnd', 'blockStart', 'blockEnd'],
    inlineEnd: ['inlineStart', 'blockStart', 'blockEnd'],
    blockStart: ['inlineStart', 'inlineEnd', 'blockEnd'],
    blockEnd: ['inlineStart', 'inlineEnd', 'blockStart'],
  },
}

export { default as packageJson } from './package.json'

// @ts-ignore
export { default as readme } from './readme.md'

export const controls: TComponentControls<TInput> = {
  isDisabled: SYMBOL_CONTROL_SWITCH,
}

