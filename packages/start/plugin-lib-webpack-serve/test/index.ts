import test from 'blue-tape'
import webpackServe from '../src'

test('plugin-lib-webpack-serve: export', (t) => {
  t.equals(
    typeof webpackServe,
    'function',
    'must be a function'
  )

  t.end()
})
