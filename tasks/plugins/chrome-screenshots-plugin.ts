/* eslint-disable import/named */
import plugin, { StartFilesProps } from '@start/plugin'
import { TOptions } from '@x-ray/chrome-screenshots'

export default (options: TOptions) =>
  plugin<StartFilesProps, void>('x-ray-chrome-screenshots', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/chrome-screenshots')

    return runFiles(files.map((file) => file.path), options)
  })
