import plugin from '@start/plugin'
import { Configuration, Stats } from 'webpack'

type Webpack = (options: Configuration, cb: (err: any, stats: Stats) => void) => void

export default (config: Configuration, userStatsOptions?: Stats.ToStringOptionsObject) =>
  plugin('webpack', () => async () => {
    const { default: makethen } = await import('makethen')
    const { default: webpackLib } = await import('webpack')
    const compiler = makethen(webpackLib as Webpack)

    const statsOptions: Stats.ToStringOptionsObject = {
      colors: true,
      ...userStatsOptions,
    }
    const stats = await compiler(config)

    console.log(stats.toString(statsOptions))

    if (stats.hasErrors()) {
      throw null
    }
  })
