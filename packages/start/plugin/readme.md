# ⚙️ plugin

Plugin creator.

## Install

```sh
$ yarn add @start/plugin
```

## Usage

### Types

See [`src/index.ts`](src/index.ts) for all the types. It's (usually) better than any words.

### Example

```js
import plugin from '@start/plugin'

export default plugin('noop', () => () => {})
```

```js
import plugin from '@start/plugin'

export default plugin('foo', ({ logPath }) => async ({ files }) => {
  const { default: fooTransform } = await import('foo-lib')

  return {
    files: await Promise.all(
      files.map(async (file) =>
        const { transformedData, sourceMap } = fooTransform(file.path)

        logPath(file.path)

        return {
          path: file.path,
          data: transformedData,
          map: sourceMap
        }
      )
    )
  }
})
```

```js
import plugin from '@start/plugin'

export default (barOptions) =>
  plugin('bar', ({ logMessage }) => async () => {
    const { default: barCheck } = await import('bar-lib')

    const barResult = barCheck(files, barOptions)

    if (barResult.issues.length === 0) {
      logMessage('¯\\_(ツ)_/¯')
    }
  })
```

## Notes

* Dynamic imports – [it's a good idea](https://github.com/gulpjs/gulp/issues/632) to "lazyload" dependencies inside of a plugin function instead of importing it on top of a file
* Plugin can return whatever "props" object or just nothing, and that output will extend an input props as an overall plugin result
* `files` – many plugins works with `files` structure: it's an array of `{ path, data, map }` objects, where:
  * `path` – absolute file path
  * `data` – file data as utf8 string, if any
  * `map` – [Source Map object](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-anatomy), if any
* `logMessage` – any random message from plugin
* `logPath` – current file path to indicate some kind of progress
* `reporter` – advanced prop which should be passed through if plugin operates other plugins, like [sequence](../plugin-sequence) or [watch](../plugin-watch)
