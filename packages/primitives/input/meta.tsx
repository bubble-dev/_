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
    value: ['foo', 'bar'],
  },
  required: ['value'],
}

export { Input as Component } from './src'
