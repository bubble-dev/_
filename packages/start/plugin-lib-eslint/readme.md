# 🚷 plugin-lib-eslint

Lint and/or fix code using [ESLint](https://eslint.org/).

## Install

```sh
$ yarn add --dev @start/plugin-lib-eslint
```

## Usage

### Signature

```ts
eslint(options?: {}, formatter?: string)
```

#### `options`

[ESLint CLIEngine options](https://eslint.org/docs/developer-guide/nodejs-api#cliengine).

Default:

```js
{
  cache: true,
  cacheLocation: 'node_modules/.cache/eslint'
}
```

#### `formatter`

[ESLint formatter](https://eslint.org/docs/developer-guide/nodejs-api#clienginegetformatter).

### Example

```js
import sequence from '@start/plugin-sequence'
import findGitStaged from '@start/plugin-find-git-staged'
import read from '@start/plugin-read'
import eslint from '@start/plugin-lib-eslint'

export const task = () =>
  sequence(
    findGitStaged('src/**/*.js'),
    read,
    eslint({
      rules: {
        'no-undef': 'error'
      }
    })
  )
```

```js
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import eslint from '@start/plugin-lib-eslint'
import overwrite from '@start/plugin-overwrite'

export const task = () =>
  sequence(
    find('src/**/*.js'),
    read,
    eslint({ fix: true }),
    overwrite
  )
```
