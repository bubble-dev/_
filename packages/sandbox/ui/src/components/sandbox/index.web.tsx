import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapContext } from 'refun'
import { Background } from '../background'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { TComponents, TPlugin } from '../../types'
import { DemoArea } from '../demo-area'
import { ThemeContext, RootThemeProvider } from '../theme-provider'
import { NavigationSidebar } from '../navigation-sidebar'
import { Toolbar, TOOLBAR_HEIGHT } from '../toolbar'
import { Layout, Layout_Item } from '../layout'
import { ControlsSidebar } from '../controls-sidebar'
import { RootContext } from '../root'
import { mapImportedComponent } from './map-imported-component'
import { mapConsoleLines } from './map-console-lines'

const BORDER_SIZE = 1
const CONTROLS_SIDEBAR_MIN_WIDTH = 300
const CONTROLS_SIDEBAR_MAX_WIDTH = 500
const NAVIGATION_SIDEBAR_MIN_WIDTH = 150
const NAVIGATION_SIDEBAR_MAX_WIDTH = 300

export type TSandbox = {
  components: TComponents,
  copyImportPackageName?: string,
  plugin?: TPlugin,
}

export const Sandbox = component(
  startWithType<TSandbox>(),
  mapContext(ThemeContext),
  mapContext(RootContext),
  mapStoreState(({ componentKey, selectedSetIndex, isNavigationSidebarVisible, isControlsSidebarVisible }) => ({
    componentKey,
    selectedSetIndex,
    isNavigationSidebarVisible,
    isControlsSidebarVisible,
  }), ['componentKey', 'selectedSetIndex', 'isNavigationSidebarVisible', 'isControlsSidebarVisible']),
  mapStoreDispatch,
  mapImportedComponent(),
  mapConsoleLines(),
  mapWithProps(({ _rootWidth }) => ({
    navigationSidebarWidth: Math.min(Math.max(_rootWidth * 0.2, NAVIGATION_SIDEBAR_MIN_WIDTH), NAVIGATION_SIDEBAR_MAX_WIDTH),
    controlsSidebarWidth: Math.min(Math.max(_rootWidth * 0.3, CONTROLS_SIDEBAR_MIN_WIDTH), CONTROLS_SIDEBAR_MAX_WIDTH),
  }))
)(({
  plugin,
  theme,
  copyImportPackageName,
  navigationSidebarWidth,
  controlsSidebarWidth,
  isNavigationSidebarVisible,
  isControlsSidebarVisible,
  components,
  Component,
  componentConfig,
  componentProps,
  componentPropsChildrenMap,
  packageInfo,
  consoleLinesRef,
}) => (
  <RootThemeProvider>
    <Layout>
      {isNavigationSidebarVisible && (
        <Layout_Item id="navigation" width={navigationSidebarWidth}>
          <NavigationSidebar components={components}/>
        </Layout_Item>
      )}

      <Layout_Item id="demo_area">
        <Layout direction="vertical">
          <Layout_Item>
            <DemoArea
              Component={Component}
              componentConfig={componentConfig}
              componentProps={componentProps}
              componentPropsChildrenMap={componentPropsChildrenMap}
              plugin={plugin}
            />
          </Layout_Item>

          <Layout_Item height={BORDER_SIZE}>
            <Background color={theme.sandboxBorderColor}/>
          </Layout_Item>

          <Layout_Item height={TOOLBAR_HEIGHT}>
            <Toolbar plugin={plugin}/>
          </Layout_Item>
        </Layout>
      </Layout_Item>

      {isControlsSidebarVisible && (
        <Fragment>
          <Layout_Item id="controls_border" width={BORDER_SIZE}>
            <Background color={theme.sandboxBorderColor}/>
          </Layout_Item>
          <Layout_Item id="controls" width={controlsSidebarWidth}>
            <ControlsSidebar
              Component={Component}
              componentConfig={componentConfig}
              componentProps={componentProps}
              componentPropsChildrenMap={componentPropsChildrenMap}
              copyImportPackageName={copyImportPackageName}
              packageInfo={packageInfo}
              consoleLines={consoleLinesRef.current}
            />
          </Layout_Item>
        </Fragment>
      )}
    </Layout>
  </RootThemeProvider>
))

Sandbox.displayName = 'Sandbox'
