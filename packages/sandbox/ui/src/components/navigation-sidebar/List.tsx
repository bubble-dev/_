import React from 'react'
import { startWithType, component, mapHandlers, mapContext } from 'refun'
import { ThemeContext } from '../theme-provider'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setComponent } from '../../actions'
import { Layout, Layout_Item } from '../layout'
import { LayoutContext } from '../layout-context'
import { ListItem } from './ListItem'

const ITEM_HEIGHT = 40

export type TList = {
  items: string[],
}

export const List = component(
  startWithType<TList>(),
  mapContext(LayoutContext),
  mapContext(ThemeContext),
  mapStoreState(({ componentKey }) => ({
    componentKey,
  }), ['componentKey']),
  mapStoreDispatch,
  mapHandlers({
    onChangeComponentName: ({ dispatch }) => (value: string) => dispatch(setComponent(value)),
  })
)(({
  _width,
  items,
  componentKey,
  onChangeComponentName,
}) => (
  <Layout direction="vertical" vPadding={15}>
    {items.map((item) => (
      <Layout_Item key={item} height={ITEM_HEIGHT} vAlign="center" hPadding={_width * 0.1}>
        <ListItem
          isActive={item === componentKey}
          onPress={onChangeComponentName}
        >
          {item}
        </ListItem>
      </Layout_Item>
    ))}
  </Layout>
))

List.displayName = 'NavigationSidebarList'
List.componentSymbol = Symbol('NAVIGATION_SIDEBAR_LIST')
