import path from 'path'
import Webpack, { Configuration as WebpackConfig } from 'webpack'
import WebpackDevServer, { Configuration as TWebpackDevServerConfig } from 'webpack-dev-server'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { browsersList } from '@bubble-dev/browsers-list'

export type TServeJsBundleOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath: string,
}

export const run = (options: TServeJsBundleOptions) => {
  const config: WebpackConfig = {
    mode: 'development',
    entry: path.resolve(options.entryPointPath),
    output: {
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '/',
      pathinfo: true,
    },
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.ts',
        '.tsx',
        '.json',
      ],
    },
    module: {
      rules: [
        {
          test: path.resolve(options.entryPointPath),
          use: [
            {
              loader: require.resolve('./loader.js'),
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /[\\/]node_modules[\\/]/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      targets: { browsers: browsersList },
                      exclude: ['@babel/plugin-transform-regenerator'],
                      ignoreBrowserslistConfig: true,
                      modules: false,
                    },
                  ],
                  require.resolve('@babel/preset-react'),
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  require.resolve('@babel/plugin-syntax-dynamic-import'),
                ],
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: path.resolve(options.htmlTemplatePath),
      }),
    ],
  }
  const compiler = Webpack(config)
  const { host, port, ...devConfig }: TWebpackDevServerConfig = {
    host: '127.0.0.1',
    port: 3000,
    contentBase: path.resolve(options.assetsPath),
  }
  const server = new WebpackDevServer(compiler, devConfig)

  return new Promise<void>((resolve, reject) => {
    compiler.hooks.done.tap('done', () => {
      resolve()
    })

    server
      .listen(port, host, (error) => {
        if (error) {
          reject(error)
        }
      })
      .on('error', reject)
  })
}
