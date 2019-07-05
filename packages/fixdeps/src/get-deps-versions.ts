import { TDepsEntries } from './types'
import { getLocalPackageVersionYarn } from './get-local-package-version-yarn'
import { getRemotePackageVersionNpm } from './get-remote-package-version-npm'

const cachedVersions = new Map<string, string>()

export const getDepsVersions = async (names: string[]): Promise<TDepsEntries> => {
  const result: TDepsEntries = []

  for (const missingDep of names) {
    const yarnVersion = cachedVersions.has(missingDep)
      ? cachedVersions.get(missingDep)!
      : await getLocalPackageVersionYarn(missingDep)

    if (yarnVersion !== null) {
      cachedVersions.set(missingDep, yarnVersion)

      result.push([missingDep, `^${yarnVersion}`])

      continue
    }

    const npmVersion = await getRemotePackageVersionNpm(missingDep)

    cachedVersions.set(missingDep, npmVersion)

    result.push([missingDep, `^${npmVersion}`])
  }

  return result
}
