/* eslint-disable no-loop-func */
import { Keys, MutexGroup, Permutation, PropsWithValues, TProps, MutinGroup } from './types'
import { arrayIntersect } from './array-intersect'
import {
  bumpPermutation,
  getInitialPermutation,
  getLengthPermutation,
  getTotalPermutations,
} from './permutation-utils'

export const getPermutations = <Props extends TProps> (
  props: PropsWithValues<Props>,
  keys: Keys<Props>,
  mutexGroups: MutexGroup<Props>[] = [],
  mutinGroups: MutinGroup<Props>[] = []
): Permutation<Props>[] => {
  /* length permutation and total possible permutations */
  const lengthPerm = getLengthPermutation(props, keys)
  const totalPerms = getTotalPermutations(lengthPerm)

  /* bump function */
  const bump = bumpPermutation(lengthPerm)

  /* initial permutation */
  const currentPerm = getInitialPermutation(lengthPerm)

  /* iterate over all possible permutations */
  const perms = [] as Permutation<Props>[]

  const keysWithState = []

  for (let pi = 0; pi < totalPerms; ++pi) {
    /* get next permutation, skip first */
    if (pi > 0) {
      bump(currentPerm)
    }

    /* check mutex groups */
    let validPerm = true

    if (mutexGroups.length > 0 || mutinGroups.length > 0) {
      let keysWithStateLength = 0

      for (let i = 0; i < keys.length; ++i) {
        if (currentPerm[i] > 0) {
          keysWithState[keysWithStateLength++] = keys[i]
        }
      }

      for (let i = 0; i < mutexGroups.length; ++i) {
        const mutexGroup = mutexGroups[i]

        if (arrayIntersect(keysWithState, keysWithStateLength, mutexGroup, mutexGroup.length) > 1) {
          validPerm = false

          let rightSecondIndex = -1

          for (let key = false, rmi = currentPerm.length - 1; rmi >= 0; --rmi) {
            if (currentPerm[rmi] === 1) {
              if (key) {
                rightSecondIndex = rmi

                break
              }

              key = true
            }
          }

          let skipLength = 1

          for (let p = 0; p < rightSecondIndex; ++p) {
            skipLength *= (lengthPerm[p] - currentPerm[p])
          }

          // console.log('PERM', currentPerm)
          // console.log('LENGTH', lengthPerm)
          // console.log('SKIP', skipLength)

          if (skipLength > 1) {
            pi += skipLength - 2
          }

          break
        }
      }

      if (validPerm) {
        for (let i = 0; i < mutinGroups.length; ++i) {
          const mutinGroup = mutinGroups[i]
          const intersect = arrayIntersect(keysWithState, keysWithStateLength, mutinGroup, mutinGroup.length)

          if (intersect !== 0 && intersect !== mutinGroup.length) {
            validPerm = false

            break
          }
        }
      }
    }

    /* push valid permutation */
    if (validPerm) {
      perms.push(currentPerm.slice() as Permutation<Props>)
    }
  }

  return perms
}
