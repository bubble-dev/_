import React, { FC } from 'react'
import { startWithType, pureComponent, mapHandlers, mapContext } from 'refun'
import { isDefined, TAnyObject } from 'tsfn'
import { Layout, Layout_Item } from '../layout'
import { IconCopy } from '../icons'
import { ButtonIcon } from '../button-icon'
import { Tooltip } from '../tooltip'
import { ThemeContext, mapContextOverride, ButtonIconThemeContext } from '../theme-provider'
import { NotificationContext } from '../notification-provider'
import { serializeComponentToText } from './serialize-component-to-text'

export type TCopySourceButton = {
  Component: FC,
  componentProps: Readonly<TAnyObject>,
}

export const CopySourceButton = pureComponent(
  startWithType<TCopySourceButton>(),
  mapContext(ThemeContext),
  mapContext(NotificationContext),
  mapContextOverride('ButtonIconThemeProvider', ButtonIconThemeContext, ({ theme }) => ({
    backgroundColor: theme.controlsSidebarIconBackgroundColor,
    hoveredBackgroundColor: theme.controlsSidebarIconBackgroundColor,
    pressedBackgroundColor: theme.controlsSidebarIconBackgroundColor,
    iconColor: theme.controlsSidebarIconColor,
    hoveredIconColor: theme.controlsSidebarIconColor,
    pressedIconColor: theme.controlsSidebarIconColor,
    focusedBorderColor: theme.controlsSidebarIconBackgroundColor,
  })),
  mapHandlers({
    onCopySource: ({ Component, componentProps, sendNotification }) => () => {
      if (isDefined(Component) && isDefined(componentProps)) {
        navigator.clipboard.writeText(
          serializeComponentToText(Component, componentProps)
        )
        sendNotification('Copied to clipboard')
      }
    },
  })
)(({ ButtonIconThemeProvider, onCopySource }) => (
  <Layout hPadding={20} vPadding={20}>
    <Layout_Item hAlign="right">
      <ButtonIconThemeProvider>
        <ButtonIcon onPress={onCopySource}>
          <IconCopy/>
          <Tooltip arrowPosition="top-right">
            Copy Source
          </Tooltip>
        </ButtonIcon>
      </ButtonIconThemeProvider>
    </Layout_Item>
  </Layout>
))
