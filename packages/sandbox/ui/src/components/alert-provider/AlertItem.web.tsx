import React from 'react'
import { component, startWithType, mapHandlers, mapContext } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { Background } from '../background'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { Button } from '../button'
import { SizeText } from '../size-text'
import { ThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'

export type TAlertItem = {
  id: string,
  children: string,
  onClose: (id: string) => void,
}

export const AlertItem = component(
  startWithType<TAlertItem>(),
  mapContext(ThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.alertColor,
  })),
  mapHandlers({
    onClose: ({ id, onClose }) => () => {
      onClose(id)
    },
  })
)(({
  theme,
  TextThemeProvider,
  children,
  onClose,
}) => (
  <TextThemeProvider>
    <Layout hPadding={10} vPadding={10}>
      <Background color={theme.alertBackgroundColor}/>
      <Layout_Item vAlign="center">
        <SizeText>
          {children}
        </SizeText>
      </Layout_Item>
      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
        <Button onPress={onClose}>
          <SizeText>
            Dismiss
          </SizeText>
        </Button>
      </Layout_Item>
    </Layout>
  </TextThemeProvider>
))
