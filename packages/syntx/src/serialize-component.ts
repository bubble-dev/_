import { FC } from 'react'
import { TConfig, TRoot } from './types'
import { serializeElement } from './serialize-element'
import { getDisplayName } from './utils'

export const serializeComponent = (Component: FC<any>, props: any, config: TConfig): TRoot => {
  const name = getDisplayName(Component)
  const { body } = serializeElement({
    name,
    currentIndent: 0,
    childIndex: 0,
    props,
    config,
    path: [],
  })

  return {
    lines: body,
  }
}
