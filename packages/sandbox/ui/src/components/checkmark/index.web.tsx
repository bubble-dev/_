import React from 'react'
import {
  mapWithProps,
  startWithType,
  mapHovered,
  TMapHovered,
  mapPressed,
  TMapPressed,
  mapKeyboardFocused,
  TMapKeyboardFocused,
  pureComponent,
  mapDefaultProps,
  mapContext,
} from 'refun'
import { elegir } from 'elegir'
import { Block } from '../block'
import { Border } from '../border'
import { Background } from '../background'
import { Checkbox } from '../checkbox'
import { CheckmarkThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { SYMBOL_CHECKMARK } from '../../symbols'
import { IconCheckmarkSmall } from '../icons'
import { SizeBlock } from '../size-block'
import { TRANSPARENT } from '../theme-provider/colors'

const WIDTH = 20
const HEIGHT = 20
const RADIUS = 5
const BORDER_WIDTH = 1
const ICON_OFFSET = 4
const KEYBOARD_BORDER_OFFSET = 4
const KEYBOARD_BORDER_WIDTH = 2
const KEYBOARD_BORDER_RADIUS = RADIUS + KEYBOARD_BORDER_OFFSET

export type TCheckmark = {
  isDisabled?: boolean,
  isChecked: boolean,
  onToggle: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const Checkmark = pureComponent(
  startWithType<TCheckmark>(),
  mapDefaultProps({
    isDisabled: false,
  }),
  mapContext(CheckmarkThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    isDisabled,
    isHovered,
    isPressed,
    isKeyboardFocused,
    isChecked,
    backgroundColor,
    activeBackgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
    activeHoveredBackgroundColor,
    activePressedBackgroundColor,
    disabledBackgroundColor,
    activeDisabledBackgroundColor,
    borderColor,
    activeBorderColor,
    hoveredBorderColor,
    pressedBorderColor,
    activeHoveredBorderColor,
    activePressedBorderColor,
    disabledBorderColor,
    activeDisabledBorderColor,
    focusedOuterBorderColor,
    activeFocusedOuterBorderColor,
    iconColor,
    hoveredIconColor,
    pressedIconColor,
    disabledIconColor,
  }) => ({
    color: elegir(
      !isChecked,
      TRANSPARENT,
      isDisabled,
      disabledIconColor,
      isPressed,
      pressedIconColor,
      isHovered,
      hoveredIconColor,
      true,
      iconColor
    ),
    backgroundColor: elegir(
      isChecked && isDisabled,
      activeDisabledBackgroundColor,
      isDisabled,
      disabledBackgroundColor,
      isChecked && isPressed,
      activePressedBackgroundColor,
      isPressed,
      pressedBackgroundColor,
      isChecked && isHovered,
      activeHoveredBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      isChecked,
      activeBackgroundColor,
      true,
      backgroundColor
    ),
    borderColor: elegir(
      isChecked && isDisabled,
      activeDisabledBorderColor,
      isDisabled,
      disabledBorderColor,
      isChecked && isPressed,
      activePressedBorderColor,
      isPressed,
      pressedBorderColor,
      isChecked && isHovered,
      activeHoveredBorderColor,
      isHovered,
      hoveredBorderColor,
      isChecked,
      activeBorderColor,
      true,
      borderColor
    ),
    keyboardBorderColor: elegir(
      isChecked && isKeyboardFocused,
      activeFocusedOuterBorderColor,
      isKeyboardFocused,
      focusedOuterBorderColor,
      true,
      TRANSPARENT
    ),
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  isDisabled,
  isChecked,
  borderColor,
  backgroundColor,
  keyboardBorderColor,
  IconThemeProvider,
  onToggle,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <SizeBlock width={WIDTH} height={HEIGHT}>
    <Checkbox
      isDisabled={isDisabled}
      isChecked={isChecked}
      onToggle={onToggle}
      onFocus={onFocus}
      onBlur={onBlur}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Background
        topLeftRadius={RADIUS}
        topRightRadius={RADIUS}
        bottomLeftRadius={RADIUS}
        bottomRightRadius={RADIUS}
        color={backgroundColor}
      />
      <Border
        topLeftRadius={RADIUS}
        topRightRadius={RADIUS}
        bottomLeftRadius={RADIUS}
        bottomRightRadius={RADIUS}
        color={borderColor}
        topWidth={BORDER_WIDTH}
        bottomWidth={BORDER_WIDTH}
        leftWidth={BORDER_WIDTH}
        rightWidth={BORDER_WIDTH}
      />
      <Border
        topLeftRadius={KEYBOARD_BORDER_RADIUS}
        topRightRadius={KEYBOARD_BORDER_RADIUS}
        bottomLeftRadius={KEYBOARD_BORDER_RADIUS}
        bottomRightRadius={KEYBOARD_BORDER_RADIUS}
        color={keyboardBorderColor}
        topWidth={KEYBOARD_BORDER_WIDTH}
        bottomWidth={KEYBOARD_BORDER_WIDTH}
        leftWidth={KEYBOARD_BORDER_WIDTH}
        rightWidth={KEYBOARD_BORDER_WIDTH}
        overflow={KEYBOARD_BORDER_OFFSET}
      />
      <Block left={ICON_OFFSET} top={ICON_OFFSET}>
        <IconThemeProvider>
          <IconCheckmarkSmall/>
        </IconThemeProvider>
      </Block>
    </Checkbox>
  </SizeBlock>
))

Checkmark.displayName = 'Checkmark'
Checkmark.componentSymbol = SYMBOL_CHECKMARK
