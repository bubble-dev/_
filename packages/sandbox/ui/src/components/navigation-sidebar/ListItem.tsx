import React from 'react'
import { startWithType, TMapHovered, TMapPressed, mapHovered, mapPressed, mapKeyboardFocused, pureComponent, mapContext, mapWithProps, TMapKeyboardFocused, mapHandlers } from 'refun'
import { elegir } from 'elegir'
import { Background } from '../background'
import { Button } from '../button'
import { SizeText } from '../size-text'
import { ThemeContext, TextThemeContext, mapContextOverride } from '../theme-provider'

export type TListItem = {
  isActive: boolean,
  children: string,
  onPress: (item: string) => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const ListItem = pureComponent(
  startWithType<TListItem>(),
  mapContext(ThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapHandlers({
    onPress: ({ onPress, children }) => () => {
      onPress(children)
    },
  }),
  mapWithProps(({ theme, isActive, isKeyboardFocused, isHovered, isPressed }) => ({
    backgroundColor: elegir(
      isActive,
      theme.navigationSidebarActiveItemBackgroundColor,
      isPressed,
      theme.navigationSidebarPressedItemBackgroundColor,
      isHovered,
      theme.navigationSidebarHoveredItemBackgroundColor,
      isKeyboardFocused,
      theme.navigationSidebarFocusedItemBackgroundColor,
      true,
      theme.navigationSidebarBackgroundColor
    ),
    color: elegir(
      isActive,
      theme.navigationSidebarActiveItemColor,
      isPressed,
      theme.navigationSidebarPressedItemColor,
      isHovered,
      theme.navigationSidebarHoveredItemColor,
      isKeyboardFocused,
      theme.navigationSidebarFocusedItemColor,
      true,
      theme.navigationSidebarItemColor
    ),
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  backgroundColor,
  TextThemeProvider,
  children,
  isKeyboardFocused,
  onFocus,
  onBlur,
  onPress,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <TextThemeProvider>
    <Background color={backgroundColor}/>
    <Button
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <SizeText isUnderlined={isKeyboardFocused}>
        {children}
      </SizeText>
    </Button>
  </TextThemeProvider>
))

ListItem.displayName = 'ListItem'
ListItem.componentSymbol = Symbol('NAVIGATION_SIDEBAR_LIST_ITEM')
