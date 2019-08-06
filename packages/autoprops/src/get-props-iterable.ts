import BigInt, { BigInteger } from 'big-integer'
import { getProps } from './get-props'
import { getNextPerm } from './get-next-perm'
import { TMetaFile } from './types'

export const getPropsIterable = (metaFile: TMetaFile) => ({
  decimal: BigInt.zero as BigInteger | null,
  *[Symbol.iterator]() {
    while (this.decimal !== null) {
      yield getProps(this.decimal, metaFile)

      this.decimal = getNextPerm(this.decimal, metaFile)
    }
  },
})
