import React from 'react'
import { component, startWithType, TMapHovered, TMapKeyboardFocused, mapHovered, mapContext, mapKeyboardFocused, mapPressed, mapWithProps } from 'refun'
import { elegir } from 'elegir'
import { SizeBlock } from '../size-block'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { IconReset } from '../icons'
import { Tooltip } from '../tooltip'
import { SizeContent } from '../size-content'
import { Button } from '../button'
import { Border } from '../border'
import { ButtonIconThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { TRANSPARENT } from '../theme-provider/colors'
import { Background } from '../background'

const WIDTH = 75
const HEIGHT = 30
const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const RADIUS = HEIGHT / 2
const BORDER_RADIUS = RADIUS + BORDER_OVERFLOW

export type TZoomLevel = {
  onPress: () => void,
  children: string,
} & TMapHovered
  & TMapKeyboardFocused

export const ZoomLevel = component(
  startWithType<TZoomLevel>(),
  mapContext(ButtonIconThemeContext),
  mapHovered,
  mapKeyboardFocused,
  mapPressed,
  mapWithProps(({
    isKeyboardFocused,
    isPressed,
    isHovered,
    backgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
    iconColor,
    hoveredIconColor,
    pressedIconColor,
    focusedBorderColor,
  }) => ({
    borderColor: isKeyboardFocused
      ? focusedBorderColor
      : TRANSPARENT,
    backgroundColor: elegir(
      isPressed,
      pressedBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      true,
      backgroundColor
    ),
    color: elegir(
      isPressed,
      pressedIconColor,
      isHovered,
      hoveredIconColor,
      true,
      iconColor
    ),
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  backgroundColor,
  borderColor,
  isHovered,
  TextThemeProvider,
  onPress,
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  children,
}) => (
  <SizeBlock width={WIDTH} height={HEIGHT}>
    {isHovered && (
      <Tooltip>
        Reset transform
      </Tooltip>
    )}
    <Layout>
      <Layout_Item hAlign="right">
        <Button
          onPress={onPress}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <TextThemeProvider>
            <Layout hPadding={10}>
              <Border
                color={borderColor}
                topLeftRadius={BORDER_RADIUS}
                topRightRadius={BORDER_RADIUS}
                bottomLeftRadius={BORDER_RADIUS}
                bottomRightRadius={BORDER_RADIUS}
                topWidth={BORDER_WIDTH}
                bottomWidth={BORDER_WIDTH}
                leftWidth={BORDER_WIDTH}
                rightWidth={BORDER_WIDTH}
                overflow={BORDER_OVERFLOW}
              />
              <Background
                color={backgroundColor}
                topLeftRadius={RADIUS}
                topRightRadius={RADIUS}
                bottomLeftRadius={RADIUS}
                bottomRightRadius={RADIUS}
              />
              <Layout_Item vAlign="center">
                <SizeText>
                  {children}
                </SizeText>
              </Layout_Item>

              <Layout_Item vAlign="center">
                <SizeContent>
                  <IconReset/>
                </SizeContent>
              </Layout_Item>
            </Layout>
          </TextThemeProvider>
        </Button>
      </Layout_Item>
    </Layout>
  </SizeBlock>
))
