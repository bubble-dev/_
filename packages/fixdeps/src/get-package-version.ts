import { getLocalPackageVersionYarn } from './get-local-package-version-yarn'
import { getRemotePackageVersionNpm } from './get-remote-package-version-npm'

const cachedVersions = new Map<string, string>()

export const getPackageVersion = async (name: string) => {
  const yarnVersion = cachedVersions.has(name)
    ? cachedVersions.get(name)!
    : await getLocalPackageVersionYarn(name)

  if (yarnVersion !== null) {
    cachedVersions.set(name, yarnVersion)

    return yarnVersion
  }

  const npmVersion = await getRemotePackageVersionNpm(name)

  cachedVersions.set(name, npmVersion)

  return npmVersion
}
