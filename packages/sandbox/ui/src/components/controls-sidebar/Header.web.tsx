import React, { FC } from 'react'
import { startWithType, mapContext, mapHandlers, pureComponent } from 'refun'
import { ThemeContext, mapContextOverride, ButtonIconThemeContext } from '../theme-provider'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { getComponentName, globalObject } from '../../utils'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { ButtonIcon } from '../button-icon'
import { IconCopy } from '../icons'
import { Tooltip } from '../tooltip'
import { NotificationContext } from '../notification-provider'
import { SizeBlock } from '../size-block'

const HEIGHT = 70

export type THeader = {
  Component: FC,
}

export const Header = pureComponent(
  startWithType<THeader>(),
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
    onCopyUrl: ({ sendNotification }) => () => {
      navigator.clipboard.writeText(globalObject.location.href)
      sendNotification('Copied Url')
    },
  })
)(({
  Component,
  ButtonIconThemeProvider,
  onCopyUrl,
}) => (
  <SizeBlock height={HEIGHT}>
    <ButtonIconThemeProvider>
      <Layout hPadding={20} spaceBetween={10}>
        <Layout_Item vAlign="center">
          <SizeText>
            {getComponentName(Component)}
          </SizeText>
        </Layout_Item>

        <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
          <ButtonIcon onPress={onCopyUrl}>
            <IconCopy/>
            <Tooltip arrowPosition="top-right">
              Copy Url
            </Tooltip>
          </ButtonIcon>
        </Layout_Item>
      </Layout>
    </ButtonIconThemeProvider>
  </SizeBlock>
))

Header.displayName = 'Header'
Header.componentSymbol = Symbol('CONTROLS_SIDEBAR_SYMBOL')
