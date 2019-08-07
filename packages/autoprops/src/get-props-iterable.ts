import BigInt, { BigInteger } from 'big-integer'
import { getPropsImpl } from './get-props'
import { getNextPermImpl } from './get-next-perm'
import { TMetaFile } from './types'

export const getPropsIterable = (metaFile: TMetaFile) => ({
  decimal: BigInt.zero as BigInteger | null,
  *[Symbol.iterator]() {
    while (this.decimal !== null) {
      yield getPropsImpl(this.decimal, metaFile)

      this.decimal = getNextPermImpl(this.decimal, metaFile)
    }
  },
})
