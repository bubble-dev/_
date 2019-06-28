import { TChildrenConfig, TComponentConfig } from 'react-autoprops'

// export const childrenConfig: TChildrenConfig = {
//   meta: {
//     icon: RadicalButtonIconMeta,
//     loader: RadicalButtonLoaderMeta,
//   },
//   children: ['icon', 'loader'],
// }

export const config: TComponentConfig = {
  props: {
    isDisabled: [true],
  },
}

export { Button as Component } from './src'
