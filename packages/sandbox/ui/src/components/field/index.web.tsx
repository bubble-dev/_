import React from 'react'
import {
  pureComponent,
  startWithType,
  TMapHovered,
  TMapFocused,
  mapHandlers,
  mapContext,
} from 'refun'
import { Input } from '@primitives/input'
import { Pointer } from '@primitives/pointer'
import { Text } from '@primitives/text'
import { isFunction, isString } from 'tsfn'
import { AnimationColor } from '../animation-color'
import { TId } from '../../types'
import { SYMBOL_FIELD } from '../../symbols'
import { SizeBlock } from '../size-block'
import { FieldThemeContext } from '../theme-provider'
import { Block } from '../block'

export type TField = {
  placeholder?: string,
  value: string,
  onChange: (value: string) => void,
  onSubmit?: () => void,
} & TId
  & TMapHovered
  & TMapFocused

export const Field = pureComponent(
  startWithType<TField>(),
  mapContext(FieldThemeContext),
  mapHandlers({
    onBlur: ({ onBlur, onSubmit }) => () => {
      if (isFunction(onBlur)) {
        onBlur()
      }

      if (isFunction(onSubmit)) {
        onSubmit()
      }
    },
  })
)(({
  height,
  lineHeight,
  color,
  leftPadding,
  rightPadding,
  fontFamily,
  fontSize,
  fontWeight,
  value,
  placeholder,
  placeholderColor,
  id,
  onChange,
  onSubmit,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}) => (
  <SizeBlock minWidth={100} height={height}>
    {value.length === 0 && isString(placeholder) && (
      <Block left={leftPadding} top={(height - lineHeight) / 2} shouldIgnorePointerEvents>
        <Text
          color={placeholderColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontWeight={fontWeight}
          shouldPreventWrap
        >
          {placeholder}
        </Text>
      </Block>
    )}
    <Pointer
      onEnter={onPointerEnter}
      onLeave={onPointerLeave}
    >
      <AnimationColor values={color}>
        {(color) => (
          <Input
            id={id}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fontSize={fontSize}
            lineHeight={lineHeight}
            color={color}
            paddingLeft={leftPadding}
            paddingRight={rightPadding}
            paddingTop={(height - lineHeight) / 2}
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      </AnimationColor>
    </Pointer>
  </SizeBlock>
))

Field.displayName = 'Field'
Field.componentSymbol = SYMBOL_FIELD
