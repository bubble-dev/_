import React from 'react'
import { startWithType, mapState, mapHandlers, mapContext, pureComponent } from 'refun'
import leven from 'leven'
import { LayoutContext } from '../layout-context'
import { Layout, Layout_Item } from '../layout'
import { SYMBOL_NAVIGATION_SIDEBAR, LAYOUT_SIZE_FIT } from '../../symbols'
import { TComponents } from '../../types'
import { Background } from '../background'
import { ThemeContext } from '../theme-provider'
import { Scroll } from '../scroll'
import { List } from './List'
import { SearchField } from './SearchField'

export type TNavigationSidebar = {
  components: TComponents,
}

export const NavigationSidebar = pureComponent(
  startWithType<TNavigationSidebar>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapState('filteredComponentNames', 'setFilteredComponentNames', ({ components }) => Object.keys(components), ['components']),
  mapHandlers({
    onChange: ({ setFilteredComponentNames, components }) => (value: string) => {
      const b = value.toLocaleLowerCase()

      setFilteredComponentNames(
        Object.keys(components).filter((name) => {
          const a = name.toLocaleLowerCase()

          if (a.startsWith(b)) {
            return true
          }

          if (b.length >= 3 && a.includes(b)) {
            return true
          }

          if (Math.abs(a.length - b.length) <= 2 && leven(name, value) <= 2) {
            return true
          }
        })
      )
    },
  })
)(({ _width, filteredComponentNames, theme, onChange }) => (
  <Layout direction="vertical">
    <Background color={theme.navigationSidebarBackgroundColor}/>
    <Layout_Item height={LAYOUT_SIZE_FIT} vPadding={20} hPadding={_width * 0.1}>
      <SearchField onChange={onChange}/>
    </Layout_Item>
    <Layout_Item>
      <Scroll shouldScrollVertically>
        <List items={filteredComponentNames}/>
      </Scroll>
    </Layout_Item>
  </Layout>
))

NavigationSidebar.displayName = 'NavigationSidebar'
NavigationSidebar.componentSymbol = SYMBOL_NAVIGATION_SIDEBAR
