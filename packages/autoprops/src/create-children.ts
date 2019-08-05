import { ReactElement, createElement } from 'react'
import { isUndefined, TAnyObject } from 'tsfn'
import { getBaseName } from './get-indexed-name'
import { TChildrenMap, TChildrenConfig } from './types'
import { isChildrenMap } from './is-children-map'

export const createChildren = (childrenConfig: TChildrenConfig, children: TChildrenMap): ReactElement | ReactElement[] => {
  const createdChildren = Object.keys(children).reduce((result, childIndexedKey, i) => {
    const childKey = getBaseName(childIndexedKey)
    const childMeta = childrenConfig.meta[childKey]
    const { Component } = childMeta
    const childrenProps = children[childIndexedKey] as TAnyObject

    if (isChildrenMap(childrenProps.children)) {
      const { children, ...props } = childrenProps

      if (isUndefined(childMeta.childrenConfig)) {
        throw new Error(`Cannot get childrenConfig for ${childMeta.Component.displayName}`)
      }

      result.push(
        createElement(Component, { ...props, key: i }, createChildren(childMeta.childrenConfig, children))
      )

      return result
    }

    result.push(
      createElement(Component, { ...childrenProps, key: i })
    )

    return result
  }, [] as ReactElement[])

  if (createdChildren.length === 1) {
    return createdChildren[0]
  }

  return createdChildren
}