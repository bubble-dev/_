# 🏭 plugin-lib-babel

Transform files using [Babel](https://babeljs.io/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-babel
```

## Usage

### Signature

```ts
babel(options?: TransformOptions)
```

#### `options`

[Babel options](https://babeljs.io/docs/usage/api/#options).

### Example

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import babel from '@start/plugin-lib-babel'
import write from '@start/plugin-write'

const babelConfig = {
  // …
  babelrc: false,
  sourceMaps: true,
}

export const task = () =>
  sequence(
    find('src/**/*.js'),
    read,
    babel(babelConfig),
    write('build/')
  )
```
