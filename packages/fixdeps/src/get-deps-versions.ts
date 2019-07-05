import { TDepsEntries } from './types'
import { getPackageVersion } from './get-package-version'

export const getDepsVersions = async (names: string[]): Promise<TDepsEntries> => {
  const result: TDepsEntries = []

  for (const missingDep of names) {
    const version = await getPackageVersion(missingDep)

    result.push([missingDep, `^${version}`])
  }

  return result
}
