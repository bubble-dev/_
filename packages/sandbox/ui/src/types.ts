import { FC } from 'react'
import { TComponentConfig } from 'autoprops'
import { TJsonValue } from 'typeon'
import { TExtend, TOmitKey } from 'tsfn'
import { TColor } from 'colorido'
import { TResolutionKey } from './resolutions'

export type TPlugin = {
  Icon: FC,
  Popover: FC,
  tooltip: string,
  Provider: FC<{ Component: FC, props: any }>,
}

export type TApp = {
  components: TComponents,
  theme?: TTheme,
  copyImportPackageName?: string,
  plugin?: TPlugin,
}

export type TPackageInfo = {
  version: string,
  stability: 'stable' | 'unstable',
  platform: string,
  designDocsUrl: string,
  sourceCodeUrl: string,
}

export type TMetaFile = {
  readonly Component: FC<any>,
  readonly config: TComponentConfig,
  readonly packageInfo: TPackageInfo,
}

export type TComponents = {
  readonly [k: string]: () => Promise<TMetaFile>,
}

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: boolean,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TOmitKey<TExtend<TAnyAction, { type: T }>, 'payload'>
export type TActionCreator<A extends TAnyAction> = () => A
export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>
export type TActionWithPayloadCreator<A extends TAnyAction> = (payload: A['payload']) => A

export type TState = Readonly<{
  width: number,
  height: number,
  hasGrid: boolean,
  shouldStretch: boolean,
  shouldInspect: boolean,
  isCanvasDarkMode: boolean,
  componentKey: string | null,
  selectedElementPath: string,
  selectedSetIndex: string,
  resolutionKey: TResolutionKey | null,
  isNavigationSidebarVisible: boolean,
  isControlsSidebarVisible: boolean,
  transformX: number,
  transformY: number,
  transformZ: number,
}>

export type TPosition = {
  readonly left: number,
  readonly top: number,
}

export type TSize = {
  readonly width: number,
  readonly height: number,
}

export type TRect = TSize & TPosition

export type TTransform = {
  readonly x: number,
  readonly y: number,
  readonly z: number,
}

export type TId = {
  id?: string,
}

export type TTheme = Readonly<{
  navigationSidebarBackgroundColor: TColor,
  navigationSidebarItemBackgroundColor: TColor,
  navigationSidebarItemColor: TColor,
  navigationSidebarActiveItemBackgroundColor: TColor,
  navigationSidebarActiveItemColor: TColor,
  navigationSidebarPressedItemBackgroundColor: TColor,
  navigationSidebarPressedItemColor: TColor,
  navigationSidebarFocusedItemBackgroundColor: TColor,
  navigationSidebarFocusedItemColor: TColor,
  navigationSidebarHoveredItemBackgroundColor: TColor,
  navigationSidebarHoveredItemColor: TColor,

  searchFieldBackgroundColor: TColor,
  searchFieldPlaceholderColor: TColor,
  searchFieldColor: TColor,
  searchFieldClearIconColor: TColor,
  searchFieldClearIconHoveredColor: TColor,
  searchFieldClearIconPressedColor: TColor,
  searchFieldClearIconFocusedBorderColor: TColor,
  searchFieldSearchIconColor: TColor,
  searchFieldSearchIconActiveColor: TColor,

  controlsColor: TColor,
  controlsPlaceholderColor: TColor,
  controlsIconColor: TColor,
  controlsActionColor: TColor,

  popoverBackgroundColor: TColor,

  tabsColor: TColor,
  tabsActiveColor: TColor,
  tabsActiveBorderColor: TColor,
  tabsDisabledColor: TColor,
  tabsBorderColor: TColor,
  tabsCloseIconColor: TColor,

  fieldColor: TColor,
  fieldPlaceholderColor: TColor,
  fieldBorderColor: TColor,
  fieldFocusedBorderColor: TColor,

  dropdownColor: TColor,
  dropdownChevronColor: TColor,
  dropdownFocusedBorderColor: TColor,

  demoAreaBackgroundColor: TColor,

  controlsSidebarBackgroundColor: TColor,
  controlsSidebarHoveredBackgroundColor: TColor,
  controlsSidebarPressedBackgroundColor: TColor,
  controlsSidebarColor: TColor,
  controlsSidebarIconBackgroundColor: TColor,
  controlsSidebarIconColor: TColor,

  toolbarBackgroundColor: TColor,
  toolbarIconColor: TColor,
  toolbarIconHoveredColor: TColor,
  toolbarIconPressedColor: TColor,
  toolbarIconActiveColor: TColor,
  toolbarIconActiveHoveredColor: TColor,
  toolbarIconActivePressedColor: TColor,
  toolbarIconFocusedBorderColor: TColor,
  toolbarIconActiveFocusedBorderColor: TColor,
  toolbarTextColor: TColor,

  tooltipBackgroundColor: TColor,
  tooltipColor: TColor,

  sourceCodeBaseWordColor: TColor,
  sourceCodeOperatorColor: TColor,
  sourceCodeHtmlSyntaxColor: TColor,
  sourceCodeTagNameColor: TColor,
  sourceCodeAttributeColor: TColor,
  sourceCodeKeywordColor: TColor,
  sourceCodeStringColor: TColor,
  sourceCodeNumberColor: TColor,
  sourceCodeBooleanColor: TColor,
  sourceCodeCommentColor: TColor,
  sourceCodeFunctionCallColor: TColor,

  sourceCodeLineColor: TColor,
  sourceCodeActiveLineColor: TColor,
  sourceCodeLineBackgroundColor: TColor,
  sourceCodeActiveLineBackgroundColor: TColor,
  sourceCodeHoveredLineBackgroundColor: TColor,
  sourceCodeActiveHoveredLineBackgroundColor: TColor,
  sourceCodePressedLineBackgroundColor: TColor,
  sourceCodeActivePressedLineBackgroundColor: TColor,
  sourceCodeCollapseIconColor: TColor,
  sourceCodeCollapseIconHoveredColor: TColor,
  sourceCodeCollapseIconPressedColor: TColor,
  sourceCodeCollapseIconFocusedBorderColor: TColor,

  linkColor: TColor,

  switchBackgroundColor: TColor,
  switchActiveBackgroundColor: TColor,
  switchKnobBackgroundColor: TColor,
  switchFocusedBorderColor: TColor,
  switchActiveFocusedBorderColor: TColor,

  checkmarkBackgroundColor: TColor,
  checkmarkActiveBackgroundColor: TColor,
  checkmarkDisabledBackgroundColor: TColor,
  checkmarkActiveDisabledBackgroundColor: TColor,
  checkmarkBorderColor: TColor,
  checkmarkActiveBorderColor: TColor,
  checkmarkDisabledBorderColor: TColor,
  checkmarkActiveDisabledBorderColor: TColor,
  checkmarkIconColor: TColor,

  notificationBackgroundColor: TColor,
  notificationColor: TColor,
  notificationCloseColor: TColor,

  alertBackgroundColor: TColor,
  alertColor: TColor,
  alertIconColor: TColor,
  alertCloseColor: TColor,

  inspectBackgroundColor: TColor,

  sandboxBorderColor: TColor,
}>
