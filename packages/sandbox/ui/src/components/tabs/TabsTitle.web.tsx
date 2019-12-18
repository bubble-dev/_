import React from 'react'
import { component, startWithType, mapHandlers, mapContext, mapWithProps, TMapKeyboardFocused, mapKeyboardFocused } from 'refun'
import { elegir } from 'elegir'
import { ThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { Border } from '../border'
import { Button } from '../button'
import { SizeText } from '../size-text'
import { TRANSPARENT } from '../theme-provider/colors'

export type TTabsTitle = {
  index: number,
  title: string,
  isDisabled: boolean,
  isActive: boolean,
  onPress: (index: number) => void,
} & TMapKeyboardFocused

export const TabsTitle = component(
  startWithType<TTabsTitle>(),
  mapContext(ThemeContext),
  mapKeyboardFocused,
  mapWithProps(({ isActive, isDisabled, isKeyboardFocused, theme }) => ({
    color: isDisabled
      ? theme.tabsColor
      : theme.tabsActiveColor,
    borderColor:
      elegir(
        isActive,
        theme.tabsActiveBorderColor,
        isKeyboardFocused,
        theme.tabsBorderColor,
        true,
        TRANSPARENT
      ),
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color })),
  mapHandlers({
    onPress: ({ index, onPress }) => () => {
      onPress(index)
    },
  })
)(({
  title,
  TextThemeProvider,
  borderColor,
  isDisabled,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <TextThemeProvider>
    <Border color={borderColor} bottomWidth={2}/>
    <Button
      isDisabled={isDisabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <SizeText>
        {title}
      </SizeText>
    </Button>
  </TextThemeProvider>
))
