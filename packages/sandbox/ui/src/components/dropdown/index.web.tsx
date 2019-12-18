import React, { Fragment } from 'react'
import {
  pureComponent,
  startWithType,
  TMapHovered,
  mapWithPropsMemo,
  mapContext,
  TMapKeyboardFocused,
  mapWithProps,
  mapHovered,
  mapKeyboardFocused,
} from 'refun'
import { isUndefined } from 'tsfn'
import { Select, Option, TOption } from '@primitives/select'
import { Pointer } from '@primitives/pointer'
import { TId } from '../../types'
import { IconChevronDown } from '../icons'
import { DropdownThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { SYMBOL_DROPDOWN, LAYOUT_SIZE_FIT } from '../../symbols'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { SizeContent } from '../size-content'
import { SizeParentBlock } from '../size-parent-block'
import { Border } from '../border'
import { TRANSPARENT } from '../theme-provider/colors'

const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const RADIUS = 9

export type TDropdown = {
  value: string,
  options: readonly TOption[],
  onChange: (value: string) => void,
} & TId
  & TMapHovered
  & TMapKeyboardFocused

export const Dropdown = pureComponent(
  startWithType<TDropdown>(),
  mapContext(DropdownThemeContext),
  mapHovered,
  mapKeyboardFocused,
  mapWithProps(({ isKeyboardFocused, focusedBorderColor }) => ({
    borderColor: isKeyboardFocused ? focusedBorderColor : TRANSPARENT,
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    color,
    hoveredColor,
    isHovered,
  }) => ({
    color: isHovered ? hoveredColor : color,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
  })),
  mapWithPropsMemo(({ options, value }) => {
    const selectedOption = options.find((opt) => opt.value === value)

    return {
      label: isUndefined(selectedOption) ? 'NOT_FOUND' : selectedOption.label,
    }
  }, ['options', 'value'])
)(({
  height,
  options,
  value,
  label,
  id,
  TextThemeProvider,
  borderColor,
  onChange,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
}) => (
  <Fragment>
    <TextThemeProvider>
      <Layout hPadding={5} spaceBetween={5}>
        <Border
          color={borderColor}
          topWidth={BORDER_WIDTH}
          leftWidth={BORDER_WIDTH}
          rightWidth={BORDER_WIDTH}
          bottomWidth={BORDER_WIDTH}
          overflow={BORDER_OVERFLOW}
          topLeftRadius={RADIUS}
          topRightRadius={RADIUS}
          bottomLeftRadius={RADIUS}
          bottomRightRadius={RADIUS}
        />
        <Layout_Item height={height} vAlign="center">
          <SizeText shouldPreventSelection shouldHideOverflow shouldPreventWrap>
            {label}
          </SizeText>
        </Layout_Item>
        <Layout_Item width={LAYOUT_SIZE_FIT} height={height} vAlign="center">
          <SizeContent>
            <IconChevronDown/>
          </SizeContent>
        </Layout_Item>
      </Layout>
    </TextThemeProvider>

    <SizeParentBlock>
      <Pointer
        onEnter={onPointerEnter}
        onLeave={onPointerLeave}
      >
        <Select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          {options.map(({ value, label }) => (
            <Option
              key={value}
              label={label}
              value={value}
            />
          ))}
        </Select>
      </Pointer>
    </SizeParentBlock>
  </Fragment>
))

Dropdown.displayName = 'Dropdown'
Dropdown.componentSymbol = SYMBOL_DROPDOWN
