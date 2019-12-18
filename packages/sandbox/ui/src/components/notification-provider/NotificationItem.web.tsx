import React from 'react'
import { component, startWithType, mapHandlers, mapSafeTimeout, onMount, mapContext } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { Background } from '../background'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { Button } from '../button'
import { SizeText } from '../size-text'
import { ThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'

const TIMEOUT = 5000

export type TNotificationItem = {
  id: string,
  children: string,
  onClose: (id: string) => void,
}

export const NotificationItem = component(
  startWithType<TNotificationItem>(),
  mapContext(ThemeContext),
  mapContextOverride('NotificationTextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.notificationColor,
  })),
  mapContextOverride('CloseTextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.notificationCloseColor,
  })),
  mapHandlers({
    onClose: ({ id, onClose }) => () => {
      onClose(id)
    },
  }),
  mapSafeTimeout('timeout'),
  onMount(({ timeout, onClose }) => {
    timeout(onClose, TIMEOUT)
  })
)(({
  theme,
  NotificationTextThemeProvider,
  CloseTextThemeProvider,
  children,
  onClose,
}) => (
  <Layout hPadding={10} vPadding={10}>
    <Background color={theme.notificationBackgroundColor}/>
    <Layout_Item vAlign="center">
      <NotificationTextThemeProvider>
        <SizeText>
          {children}
        </SizeText>
      </NotificationTextThemeProvider>
    </Layout_Item>
    <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
      <Button onPress={onClose}>
        <CloseTextThemeProvider>
          <SizeText>
            Close
          </SizeText>
        </CloseTextThemeProvider>
      </Button>
    </Layout_Item>
  </Layout>
))
