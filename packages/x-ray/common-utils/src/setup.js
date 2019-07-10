/* eslint-disable @typescript-eslint/no-require-imports, import/no-dynamic-require */
const babelRegister = require('@babel/register')

global.navigator = {
  userAgent: 'x-ray',
}

const options = JSON.parse(process.argv[2])
const childFile = process.argv[3]
const targetFiles = process.argv.slice(4)

const babelConfig = {
  babelrc: false,
  inputSourceMap: false,
  sourceMaps: false,
  compact: true,
  comments: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
        ignoreBrowserslistConfig: true,
        loose: true,
      },
    ],
    require.resolve('@babel/preset-react'),
    '@babel/preset-typescript',
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-dynamic-import-node'),
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: options.mocks,
        extensions: options.extensions,
      },
    ],
  ],
  extensions: options.extensions,
}

babelRegister(babelConfig)

require(childFile).default(targetFiles, options)
