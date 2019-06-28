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
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        ignoreBrowserslistConfig: true,
        loose: true,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-dynamic-import-node',
    [
      'babel-plugin-module-resolver',
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
