const TARGET_NODE_VERSION = '12.13.0'

exports.TARGET_NODE_VERSION = TARGET_NODE_VERSION

exports.babelConfigNodeBuild = {
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  sourceMaps: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: TARGET_NODE_VERSION },
        ignoreBrowserslistConfig: true,
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
    [
      require.resolve('babel-plugin-transform-inline-environment-variables'),
      {
        include: ['BABEL_ENV'],
      },
    ],
    [
      require.resolve('@babel/plugin-transform-modules-commonjs'),
      { strictMode: false },
    ],
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        require.resolve('@babel/preset-typescript'),
      ],
    },
    {
      test: /\.(ts|js)x$/,
      presets: [
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith('#') || val.startsWith('bin/sh'),
}

exports.babelConfigNodeRegister = {
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: 'current' },
        ignoreBrowserslistConfig: true,
      },
    ],
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        require.resolve('@babel/preset-typescript'),
      ],
    },
    {
      test: /\.(ts|js)x$/,
      presets: [
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  shouldPrintComment: (val) => val.startsWith('#') || val.startsWith(' istanbul'),
}
