import React, { ReactNode } from 'react'
import { elegir } from 'elegir'
import {
  mapDefaultProps,
  startWithType,
  mapWithProps,
  mapHovered,
  TMapHovered,
  mapKeyboardFocused,
  TMapKeyboardFocused,
  component,
  mapContext,
  mapPressed,
} from 'refun'
import { Checkbox } from '@primitives/checkbox'
import { Background } from '@primitives/background'
import { Border } from '@primitives/border'
import { ButtonIconSwitchThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { SYMBOL_ICON, SYMBOL_TOOLTIP, SYMBOL_BUTTON_ICON } from '../../symbols'
import { mapChildren } from '../../map/children'
import { SizeBlock } from '../size-block'
import { TRANSPARENT } from '../theme-provider/colors'
import { Layout, Layout_Item } from '../layout'
import { SizeContent } from '../size-content'

const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4

export type TButtonIconSwitch = {
  size?: number,
  accessibilityLabel?: string,
  isChecked: boolean,
  children: ReactNode,
  onToggle: () => void,
} & TMapHovered
  & TMapKeyboardFocused

export const ButtonIconSwitch = component(
  startWithType<TButtonIconSwitch>(),
  mapContext(ButtonIconSwitchThemeContext),
  mapDefaultProps({
    accessibilityLabel: '',
    size: 26,
  }),
  mapChildren({
    icon: {
      symbols: [SYMBOL_ICON],
      isRequired: true,
    },
    tooltip: {
      symbols: [SYMBOL_TOOLTIP],
    },
  }),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    size,
    isChecked,
    isKeyboardFocused,
    isPressed,
    isHovered,
    focusedBorderColor,
    activeFocusedBorderColor,
    iconColor,
    activeHoveredIconColor,
    activeIconColor,
    activePressedIconColor,
    hoveredIconColor,
    pressedIconColor,
    backgroundColor,
    activeBackgroundColor,
    activeHoveredBackgroundColor,
    activePressedBackgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
  }) => ({
    backgroundColor: elegir(
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
      isChecked && isKeyboardFocused,
      activeFocusedBorderColor,
      isKeyboardFocused,
      focusedBorderColor,
      true,
      TRANSPARENT
    ),
    color: elegir(
      isPressed && isChecked,
      activePressedIconColor,
      isPressed,
      pressedIconColor,
      isHovered && isChecked,
      activeHoveredIconColor,
      isHovered,
      hoveredIconColor,
      isChecked,
      activeIconColor,
      true,
      iconColor
    ),
    radius: size / 2,
    borderRadius: (size / 2) + BORDER_OVERFLOW,
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  size,
  radius,
  borderRadius,
  accessibilityLabel,
  backgroundColor,
  borderColor,
  IconThemeProvider,
  icon,
  tooltip,
  isChecked,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  onToggle,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <SizeBlock width={size} height={size}>
    <Background
      topLeftRadius={radius}
      topRightRadius={radius}
      bottomLeftRadius={radius}
      bottomRightRadius={radius}
      color={backgroundColor}
    />
    <Border
      color={borderColor}
      topLeftRadius={borderRadius}
      topRightRadius={borderRadius}
      bottomLeftRadius={borderRadius}
      bottomRightRadius={borderRadius}
      topWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      leftWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
      overflowTop={BORDER_OVERFLOW}
      overflowBottom={BORDER_OVERFLOW}
      overflowLeft={BORDER_OVERFLOW}
      overflowRight={BORDER_OVERFLOW}
    />
    {isHovered && tooltip}
    <Checkbox
      isChecked={isChecked}
      accessibilityLabel={accessibilityLabel}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onToggle={onToggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Layout>
        <Layout_Item hAlign="center" vAlign="center">
          <SizeContent>
            <IconThemeProvider>
              {icon}
            </IconThemeProvider>
          </SizeContent>
        </Layout_Item>
      </Layout>
    </Checkbox>
  </SizeBlock>
))

ButtonIconSwitch.displayName = 'ButtonIconSwitch'
ButtonIconSwitch.componentSymbol = SYMBOL_BUTTON_ICON
