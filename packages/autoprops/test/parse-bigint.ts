import test from 'blue-tape'
import BigInt from 'big-integer'
import { parseBigInt } from '../src/parse-bigint'

test('parseBigInt', (t) => {
  t.true(
    parseBigInt('jLPPD2sEv').equals(BigInt(Number.MAX_SAFE_INTEGER)),
    'should parse'
  )

  t.end()
})
