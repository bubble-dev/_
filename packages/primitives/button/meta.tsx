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
    a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
}

export { Button as Component } from './src'
