import { TDepsEntries } from '../types'
import { getLocalPackageVersionYarn } from './get-local-package-version-yarn'
import { getPackageVersionNpm } from './get-package-version-npm'

const cachedVersions = new Map<string, string>()

export const getDepsVersions = async (names: string[], logMessage: (message: string) => void): Promise<TDepsEntries> => {
  const result: TDepsEntries = []

  for (const missingDep of names) {
    logMessage(`requesting local version of ${missingDep}`)

    const yarnVersion = cachedVersions.has(missingDep)
      ? cachedVersions.get(missingDep)!
      : await getLocalPackageVersionYarn(missingDep)

    if (yarnVersion !== null) {
      cachedVersions.set(missingDep, yarnVersion)

      result.push([missingDep, `^${yarnVersion}`])

      continue
    }

    logMessage(`requesting npm version of ${missingDep}`)

    const npmVersion = await getPackageVersionNpm(missingDep)

    cachedVersions.set(missingDep, npmVersion)

    result.push([missingDep, `^${npmVersion}`])
  }

  return result
}
