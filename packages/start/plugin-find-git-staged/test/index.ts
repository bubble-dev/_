import test from 'blue-tape'
import findGitStaged from '../src'

test('plugin-findGitStaged: export', (t) => {
  t.equals(
    typeof findGitStaged,
    'function',
    'must be a function'
  )

  t.end()
})
