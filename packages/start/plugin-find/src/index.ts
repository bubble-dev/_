import plugin, { StartFile } from '@start/plugin'

export default (glob: string | string[], userOptions?: {}) =>
  plugin('find', ({ logPath }) => async () => {
    const { default: globby } = await import('globby')

    const options = {
      ignore: ['node_modules/**'],
      deep: true,
      onlyFiles: false,
      expandDirectories: false,
      absolute: true,
      ...userOptions,
    }
    const result = await globby(glob, options)

    result.forEach(logPath)

    return {
      files: result.map((file): StartFile => ({
        path: file,
      })),
    }
  })
