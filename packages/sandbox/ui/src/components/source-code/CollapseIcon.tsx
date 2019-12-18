import React from 'react'
import { startWithType, mapKeyboardFocused, TMapHovered, TMapPressed, TMapKeyboardFocused, mapHovered, mapPressed, mapContext, pureComponent, mapWithProps } from 'refun'
import { Button } from '@primitives/button'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Transform } from '@primitives/transform'
import { Block } from '@primitives/block'
import { elegir } from 'elegir'
import { Border } from '@primitives/border'
import { IconArrowDownSmall } from '../icons'
import { ThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { TRANSPARENT } from '../theme-provider/colors'

const RADIUS = 10
const BORDER_OVERFLOW = 4
const BORDER_WIDTH = 2

export type TCollapseIcon = {
  isCollapsed: boolean,
  onPress: () => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const CollapseIcon = pureComponent(
  startWithType<TCollapseIcon>(),
  mapContext(ThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({ isKeyboardFocused, theme }) => ({
    borderColor: elegir(
      isKeyboardFocused,
      theme.sourceCodeCollapseIconFocusedBorderColor,
      true,
      TRANSPARENT
    ),
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ isPressed, isHovered, theme }) => ({
    color: elegir(
      isPressed,
      theme.sourceCodeCollapseIconPressedColor,
      isHovered,
      theme.sourceCodeCollapseIconHoveredColor,
      true,
      theme.sourceCodeCollapseIconColor
    ),
  }))
)(({
  borderColor,
  IconThemeProvider,
  isCollapsed,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onFocus,
  onBlur,
}) => (
  <Button
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    onPress={onPress}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    onFocus={onFocus}
    onBlur={onBlur}
  >
    <Border
      color={borderColor}
      leftWidth={BORDER_WIDTH}
      topWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      topLeftRadius={RADIUS}
      topRightRadius={RADIUS}
      bottomLeftRadius={RADIUS}
      bottomRightRadius={RADIUS}
      overflowLeft={BORDER_OVERFLOW}
      overflowTop={BORDER_OVERFLOW}
      overflowRight={BORDER_OVERFLOW}
      overflowBottom={BORDER_OVERFLOW}
    />
    <IconThemeProvider>
      <Animation values={[isCollapsed ? -90 : 0]} easing={easeInOutCubic} time={200}>
        {([rotate]) => (
          <Transform rotate={rotate}>
            <Block width={12} height={12}>
              <IconArrowDownSmall/>
            </Block>
          </Transform>
        )}
      </Animation>
    </IconThemeProvider>
  </Button>
))
