import test from 'blue-tape'
import npmPublish from '../src'

test('plugin-lib-npm-publish: export', (t) => {
  t.equals(
    typeof npmPublish,
    'function',
    'must be a function'
  )

  t.end()
})
