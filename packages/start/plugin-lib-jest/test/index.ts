import test from 'blue-tape'
import jest from '../src'

test('plugin-lib-jest: export', (t) => {
  t.equals(
    typeof jest,
    'function',
    'must be a function'
  )

  t.end()
})
