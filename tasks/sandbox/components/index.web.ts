import { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import(/* webpackChunkName: "Button" */ '@primitives/button/meta'),
  Input: () => import(/* webpackChunkName: "Button" */ '@primitives/input/meta'),
}

