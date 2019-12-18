import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { mapStoreState } from '../../store'
import { TComponents, TPlugin } from '../../types'
import { DemoArea } from '../demo-area'
import { ThemeContext } from '../theme-provider'
import { mapImportedComponent } from './map-imported-component'

export type TSandbox = {
  components: TComponents,
  copyImportPackageName?: string,
  plugin?: TPlugin,
}

export const Sandbox = component(
  startWithType<TSandbox>(),
  mapContext(ThemeContext),
  mapStoreState(({ componentKey, selectedSetIndex }) => ({
    componentKey,
    selectedSetIndex,
  }), ['componentKey', 'selectedSetIndex']),
  mapImportedComponent()
)(({
  componentProps,
  Component,
}) => (
  <DemoArea
    Component={Component}
    componentProps={componentProps}
  />
))

Sandbox.displayName = 'Sandbox'
