/* eslint-disable import/named */
import plugin, { StartFilesProps } from '@start/plugin'
import { TOptions } from '@x-ray/firefox-screenshots'

export default (options: TOptions) =>
  plugin<StartFilesProps, void>('x-ray-firefox-screenshots', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/firefox-screenshots')

    return runFiles(files.map((file) => file.path), options)
  })
