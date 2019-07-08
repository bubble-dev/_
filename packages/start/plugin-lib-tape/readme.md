# ✅ plugin-lib-tape

Run tests using [Tape](https://github.com/substack/tape).

## Install

```sh
$ yarn add --dev @start/plugin-lib-tape
```

## Usage

### Signature

```ts
tape(reporter?: () => NodeJS.ReadWriteStream)
```

#### `reporter`

[TAP compatible reporter](https://github.com/substack/tape#pretty-reporters).

### Example

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import tape from '@start/plugin-lib-tape'
import tapDiff from 'tap-diff'

export const task = () =>
  sequence(
    find('test/**/*.js'),
    tape(tapDiff)
  )
```
