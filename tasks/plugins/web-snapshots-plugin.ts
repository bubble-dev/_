/* eslint-disable import/named */
import plugin, { StartFilesProps } from '@start/plugin'
import { TOptions } from '@x-ray/web-snapshots'

export default (options: TOptions) =>
  plugin<StartFilesProps, void>('x-ray-web-snapshots', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/web-snapshots')

    return runFiles(files.map((file) => file.path), options)
  })
