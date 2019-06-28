const babelRegister = require('@babel/register')

global.navigator = {
  userAgent: 'x-ray',
}

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
  ],
  extensions: [
    '.node.js',
    '.node.ts',
    '.node.tsx',
    '.web.js',
    '.web.ts',
    '.web.tsx',
    '.js',
    '.ts',
    '.tsx',
  ],
}

babelRegister(babelConfig)
