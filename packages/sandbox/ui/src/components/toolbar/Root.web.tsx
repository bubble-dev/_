import React from 'react'
import { startWithType, mapHandlers, mapContext, component } from 'refun'
import { isDefined } from 'tsfn'
import { IconTheme, IconInspect, IconChevronRight, IconChevronLeft, IconStretch, IconGrid } from '../icons'
import { Label } from '../label'
import { ButtonIconSwitch } from '../button-icon-switch'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { toggleCanvasDarkMode, toggleNavigationSidebar, toggleControlsSidebar, resetTransform, toggleStretch, toggleGrid, toggleInspect } from '../../actions'
import { ThemeContext, mapContextOverride, ButtonIconThemeContext, ButtonIconSwitchThemeContext, TextThemeContext } from '../theme-provider'
import { SwitchPopover } from '../switch-popover'
import { ButtonIcon } from '../button-icon'
import { SizeText } from '../size-text'
import { LayoutContext } from '../layout-context'
import { Layout, Layout_Item } from '../layout'
import { LAYOUT_SIZE_FIT, SYMBOL_TOOLBAR } from '../../symbols'
import { Tooltip } from '../tooltip'
import { Background } from '../background'
import { TRANSPARENT } from '../theme-provider/colors'
import { SizeContent } from '../size-content'
import { Switch } from '../switch'
import { Layout_Spacer } from '../layout'
import { WidthField } from './WidthField'
import { HeightField } from './HeightField'
import { ResolutionDropdown } from './ResolutionDropdown'
import { TToolbar } from './types'
import { ZoomLevel } from './ZoomLevel'

const SCREEN_POPOVER_WIDTH = 380
const THEME_POPOVER_WIDTH = 380

export const TOOLBAR_HEIGHT = 60

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.toolbarTextColor,
  })),
  mapContextOverride('ButtonIconThemeProvider', ButtonIconThemeContext, ({ theme }) => ({
    backgroundColor: TRANSPARENT,
    hoveredBackgroundColor: TRANSPARENT,
    pressedBackgroundColor: TRANSPARENT,
    focusedBorderColor: theme.toolbarIconFocusedBorderColor,
    iconColor: theme.toolbarIconColor,
    hoveredIconColor: theme.toolbarIconHoveredColor,
    pressedIconColor: theme.toolbarIconPressedColor,
  })),
  mapContextOverride('ButtonIconSwitchThemeProvider', ButtonIconSwitchThemeContext, ({ theme }) => ({
    backgroundColor: TRANSPARENT,
    hoveredBackgroundColor: TRANSPARENT,
    pressedBackgroundColor: TRANSPARENT,
    activeBackgroundColor: TRANSPARENT,
    activeHoveredBackgroundColor: TRANSPARENT,
    activePressedBackgroundColor: TRANSPARENT,
    focusedBorderColor: theme.toolbarIconFocusedBorderColor,
    activeFocusedBorderColor: theme.toolbarIconActiveFocusedBorderColor,
    iconColor: theme.toolbarIconColor,
    hoveredIconColor: theme.toolbarIconHoveredColor,
    pressedIconColor: theme.toolbarIconPressedColor,
    activeIconColor: theme.toolbarIconActiveColor,
    activeHoveredIconColor: theme.toolbarIconActiveHoveredColor,
    activePressedIconColor: theme.toolbarIconActivePressedColor,
  })),
  mapStoreState(({ isCanvasDarkMode, isNavigationSidebarVisible, isControlsSidebarVisible, transformZ, shouldInspect, shouldStretch, hasGrid }) => ({
    isCanvasDarkMode,
    isNavigationSidebarVisible,
    isControlsSidebarVisible,
    shouldInspect,
    shouldStretch,
    hasGrid,
    zoomLevel: `${Math.floor(transformZ * 100)}%`,
  }), ['isCanvasDarkMode', 'isNavigationSidebarVisible', 'isControlsSidebarVisible', 'transformZ', 'shouldInspect', 'shouldStretch', 'hasGrid']),
  mapStoreDispatch,
  mapHandlers({
    onToggleStretch: ({ dispatch }) => () => dispatch(toggleStretch()),
    onToggleGrid: ({ dispatch }) => () => dispatch(toggleGrid()),
    onToggleInspect: ({ dispatch }) => () => dispatch(toggleInspect()),
    onToggleDarkMode: ({ dispatch }) => () => dispatch(toggleCanvasDarkMode()),
    onToggleNavigationSidebar: ({ dispatch }) => () => dispatch(toggleNavigationSidebar()),
    onToggleControlsSidebar: ({ dispatch }) => () => dispatch(toggleControlsSidebar()),
    onResetTransform: ({ dispatch }) => () => dispatch(resetTransform()),
  })
)(({
  zoomLevel,
  plugin,
  theme,
  ButtonIconThemeProvider,
  ButtonIconSwitchThemeProvider,
  TextThemeProvider,
  isCanvasDarkMode,
  isNavigationSidebarVisible,
  isControlsSidebarVisible,
  shouldInspect,
  shouldStretch,
  hasGrid,
  onToggleDarkMode,
  onToggleNavigationSidebar,
  onToggleControlsSidebar,
  onToggleStretch,
  onToggleGrid,
  onToggleInspect,
  onResetTransform,
}) => (
  <ButtonIconSwitchThemeProvider>
    <ButtonIconThemeProvider>
      <TextThemeProvider>
        <Layout hPadding={10} spaceBetween={10}>
          <Background color={theme.toolbarBackgroundColor}/>
          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <ButtonIcon onPress={onToggleNavigationSidebar}>
              {isNavigationSidebarVisible ? <IconChevronLeft/> : <IconChevronRight/>}
              <Tooltip>
                Toggle sidebar
              </Tooltip>
            </ButtonIcon>
          </Layout_Item>

          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <SwitchPopover width={SCREEN_POPOVER_WIDTH}>
              <IconInspect/>
              <Tooltip>
                Screen options
              </Tooltip>
              <Layout direction="vertical">
                <Layout_Item height={40}>
                  <Label>
                    <Layout spaceBetween={15}>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <SizeContent>
                          <IconGrid/>
                        </SizeContent>
                      </Layout_Item>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Size
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <ResolutionDropdown/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>

                <Layout_Item height={40}>
                  <Label>
                    <Layout>
                      <Layout_Spacer width={45}/>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Width
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={65} vAlign="center">
                        <WidthField/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>

                <Layout_Item height={40}>
                  <Label>
                    <Layout>
                      <Layout_Spacer width={45}/>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Height
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={65} vAlign="center">
                        <HeightField/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>

                <Layout_Item height={40}>
                  <Label>
                    <Layout spaceBetween={15}>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <SizeContent>
                          <IconTheme/>
                        </SizeContent>
                      </Layout_Item>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Dark canvas
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <Switch isChecked={isCanvasDarkMode} onToggle={onToggleDarkMode}/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>
              </Layout>
            </SwitchPopover>
          </Layout_Item>

          {isDefined(plugin) && (
            <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
              <SwitchPopover width={THEME_POPOVER_WIDTH}>
                <plugin.Icon/>
                <plugin.Popover/>
                <Tooltip>
                  {plugin.tooltip}
                </Tooltip>
              </SwitchPopover>
            </Layout_Item>
          )}

          <Layout_Item hAlign="center">
            <Layout spaceBetween={10}>
              <Layout_Item vAlign="center">
                <ButtonIconSwitch isChecked={shouldStretch} onToggle={onToggleStretch}>
                  <IconStretch/>
                  <Tooltip>
                    Stretch component
                  </Tooltip>
                </ButtonIconSwitch>
              </Layout_Item>
              <Layout_Item vAlign="center">
                <ButtonIconSwitch isChecked={hasGrid} onToggle={onToggleGrid}>
                  <IconGrid/>
                  <Tooltip>
                    Toggle grid
                  </Tooltip>
                </ButtonIconSwitch>
              </Layout_Item>
              <Layout_Item vAlign="center">
                <ButtonIconSwitch isChecked={shouldInspect} onToggle={onToggleInspect}>
                  <IconInspect/>
                  <Tooltip>
                    Inspect component
                  </Tooltip>
                </ButtonIconSwitch>
              </Layout_Item>
            </Layout>
          </Layout_Item>

          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <ZoomLevel onPress={onResetTransform}>
              {zoomLevel}
            </ZoomLevel>
          </Layout_Item>

          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <ButtonIcon onPress={onToggleControlsSidebar}>
              {isControlsSidebarVisible ? <IconChevronRight/> : <IconChevronLeft/>}
              <Tooltip arrowPosition="bottom-right">
                Toggle sidebar
              </Tooltip>
            </ButtonIcon>
          </Layout_Item>
        </Layout>
      </TextThemeProvider>
    </ButtonIconThemeProvider>
  </ButtonIconSwitchThemeProvider>
))

Toolbar.displayName = 'Toolbar'
Toolbar.componentSymbol = SYMBOL_TOOLBAR
