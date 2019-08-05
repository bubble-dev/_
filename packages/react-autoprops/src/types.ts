import { FC } from 'react'
import { TAnyObject } from 'tsfn'

export type TMetaFile = {
  Component: FC<any>,
  config: TComponentConfig,
  childrenConfig?: TChildrenConfig,
}

export type TChildrenConfig = {
  meta: {
    [K in string]: TMetaFile
  },
  children: string[],
  mutex?: string[][],
  mutin?: string[][],
  required?: string[],
}

export type TComponentConfig = {
  props: {
    [K in string]: any[]
  },
  required?: string[],
  mutex?: string[][],
  mutin?: string[][],
}

export type TChildrenMap = {
  [K in string]?: TAnyObject
}