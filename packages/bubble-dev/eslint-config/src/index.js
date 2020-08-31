/* eslint-disable import/no-commonjs */

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'react',
    '@typescript-eslint',
    '@nextools',
  ],
  extends: [
    require.resolve('./config/core'),
    require.resolve('./config/import'),
    require.resolve('./config/react'),
    require.resolve('./config/typescript'),
  ],
  globals: {
    BigInt: 'readonly',
  },
}
