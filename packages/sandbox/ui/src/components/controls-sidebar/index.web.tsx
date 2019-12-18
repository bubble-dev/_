import { isUndefined, isString } from 'util'
import React, { FC, Fragment } from 'react'
import { startWithType, pureComponent, mapContext } from 'refun'
import { TComponentConfig } from 'autoprops'
import { TAnyObject, isDefined } from 'tsfn'
import { SYMBOL_CONTROLS_SIDEBAR, LAYOUT_SIZE_FIT } from '../../symbols'
import { ComponentControls } from '../component-controls'
import { Layout_Item, Layout } from '../layout'
import { SourceCode } from '../source-code'
import { Background } from '../background'
import { ThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'
import { Tabs, Tabs_Item } from '../tabs'
import { Console } from '../console'
import { TPackageInfo } from '../../types'
import { SourceImports } from '../source-imports'
import { Header } from './Header'
import { Info } from './Info'
import { CopySourceButton } from './CopySourceButton'
import { CopyImportsButton } from './CopyImportsButton'

export type TControlsSidebar = {
  Component?: FC<any>,
  componentConfig?: TComponentConfig,
  componentProps?: Readonly<TAnyObject>,
  componentPropsChildrenMap?: Readonly<TAnyObject>,
  copyImportPackageName?: string,
  packageInfo?: TPackageInfo,
  consoleLines: string[],
}

export const ControlsSidebar = pureComponent(
  startWithType<TControlsSidebar>(),
  mapContext(ThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({ color: theme.controlsSidebarColor }))
)(({
  copyImportPackageName,
  theme,
  Component,
  componentConfig,
  componentProps,
  componentPropsChildrenMap,
  packageInfo,
  consoleLines,
  TextThemeProvider,
}) => (
  <TextThemeProvider>
    <Background color={theme.controlsSidebarBackgroundColor}/>
    {isDefined(Component) && isDefined(componentConfig) && isDefined(componentProps) && isDefined(componentPropsChildrenMap) && (
      <Layout direction="vertical">
        <Layout_Item height={LAYOUT_SIZE_FIT}>
          <Header Component={Component}/>
        </Layout_Item>
        <Layout_Item>
          <Tabs>
            <Tabs_Item title="Code">
              {() => (
                <Fragment>
                  <SourceCode
                    Component={Component}
                    componentConfig={componentConfig}
                    componentProps={componentProps}
                    componentPropsChildrenMap={componentPropsChildrenMap}
                  />
                  <CopySourceButton
                    Component={Component}
                    componentProps={componentProps}
                  />
                </Fragment>
              )}
            </Tabs_Item>
            {isString(copyImportPackageName) && (
              <Tabs_Item title="Imports">
                {() => (
                  <Fragment>
                    <SourceImports
                      Component={Component}
                      componentProps={componentProps}
                      importPackageName={copyImportPackageName}
                    />
                    <CopyImportsButton
                      Component={Component}
                      componentProps={componentProps}
                      importPackageName={copyImportPackageName}
                    />
                  </Fragment>
                )}
              </Tabs_Item>
            )}
            <Tabs_Item title="Console">
              {() => (
                <Console consoleLines={consoleLines}/>
              )}
            </Tabs_Item>
            <Tabs_Item title="About" isDisabled={isUndefined(packageInfo)}>
              {() => (
                <Info packageInfo={packageInfo}/>
              )}
            </Tabs_Item>
          </Tabs>
        </Layout_Item>

        <Layout_Item height={1}>
          <Background color={theme.tabsBorderColor}/>
        </Layout_Item>

        <Layout_Item>
          <ComponentControls
            Component={Component}
            componentConfig={componentConfig}
            componentPropsChildrenMap={componentPropsChildrenMap}
          />
        </Layout_Item>
      </Layout>
    )}
  </TextThemeProvider>
))

ControlsSidebar.displayName = 'ControlSidebar'
ControlsSidebar.componentSymbol = SYMBOL_CONTROLS_SIDEBAR
