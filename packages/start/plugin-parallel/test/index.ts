import test from 'blue-tape'
import parallel from '../src'

test('plugin-parallel: export', (t) => {
  t.equals(
    typeof parallel,
    'function',
    'must be a function'
  )

  t.end()
})
