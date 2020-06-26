import React from 'react'
import { getChildrenKeys } from 'autoprops'
import { startWithType, pureComponent, mapHandlers, mapDebouncedHandlerTimeout, mapWithPropsMemo } from 'refun'
import { applyPropValue } from '../../store-meta'
import { Tabs, Tabs_Item } from '../tabs'
import { SYMBOL_COMPONENT_CONTROLS } from '../../symbols'
import { isHandler } from '../../utils'
import { Scroll } from '../scroll'
import { mapChildConfigByPath } from './map-child-config-by-path'
import { PropsBlock } from './PropsBlock'
import { ChildrenBlock } from './ChildrenBlock'
import { HandlersBlock } from './HandlersBlock'

export const ComponentControls = pureComponent(
  startWithType<{}>(),
  mapHandlers({
    onChange: () => applyPropValue,
  }),
  mapDebouncedHandlerTimeout('onChange', 100),
  mapChildConfigByPath(),
  mapWithPropsMemo(({ childConfig }) => {
    if (childConfig === null) {
      return {
        propKeys: [],
        handlerKeys: [],
        childrenKeys: [],
      }
    }

    const propKeys = Object.keys(childConfig.props)

    return {
      propKeys: propKeys.filter((propName) => !isHandler(propName)) as readonly string[],
      handlerKeys: propKeys.filter((propName) => isHandler(propName)) as readonly string[],
      childrenKeys: getChildrenKeys(childConfig) as readonly string[],
    }
  }, ['childConfig'])
)(({
  childPropsChildrenMap,
  childConfig,
  childPath,
  propKeys,
  handlerKeys,
  childrenKeys,
  onChange,
}) => {
  if (childConfig === null) {
    return null
  }

  return (
    <Tabs>
      <Tabs_Item title="Props" isDisabled={propKeys.length === 0}>
        {() => (
          <Scroll shouldScrollVertically>
            <PropsBlock
              componentConfig={childConfig}
              componentPropsChildrenMap={childPropsChildrenMap}
              propPath={childPath}
              propKeys={propKeys}
              onChange={onChange}
            />
          </Scroll>
        )}
      </Tabs_Item>
      <Tabs_Item title="Children" isDisabled={childrenKeys.length === 0}>
        {() => (
          <Scroll shouldScrollVertically>
            <ChildrenBlock
              componentConfig={childConfig}
              componentPropsChildrenMap={childPropsChildrenMap}
              propPath={childPath}
              childrenKeys={childrenKeys}
              onChange={onChange}
            />
          </Scroll>
        )}
      </Tabs_Item>
      <Tabs_Item title="Handlers" isDisabled={handlerKeys.length === 0}>
        {() => (
          <Scroll shouldScrollVertically>
            <HandlersBlock
              componentConfig={childConfig}
              componentPropsChildrenMap={childPropsChildrenMap}
              propPath={childPath}
              handlerKeys={handlerKeys}
              onChange={onChange}
            />
          </Scroll>
        )}
      </Tabs_Item>
    </Tabs>
  )
})

ComponentControls.displayName = 'ComponentControls'
ComponentControls.componentSymbol = SYMBOL_COMPONENT_CONTROLS
