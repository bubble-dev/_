import { getCrossDependents, getDependentsOf, getDependentsCount } from '@auto/workspaces'
import {
  compareReleaseTypes,
  TPackages,
  TGitBump,
  TPackageBump,
  TBumpType,
  getCommonBumpType,
  TBumpConfig,
} from '@auto/utils'
import { bumpRange } from './bump-range'
import { bumpVersion } from './bump-version'
import { compileBumpConfig } from './compile-bump-config'
import { resolveBumpType } from './resolve-bump-type'

export const getPackagesBumps = (packages: TPackages, bumps: TGitBump[], rootConfig?: TBumpConfig): TPackageBump[] => {
  for (const bump of bumps) {
    if (!Reflect.has(packages, bump.name)) {
      throw new Error(`Unable to find package ${bump.name} in packages`)
    }
  }

  const crossDependents = getCrossDependents(packages)
  const bumpStack: { [name: string]: TPackageBump } = {}

  const bumpDependents = (name: string, version: string, type: TBumpType, pkgConfig: Required<TBumpConfig>): void => {
    const resolvedType = resolveBumpType(type, pkgConfig)
    const dependents = getDependentsOf(crossDependents, packages, name)

    if (dependents === null) {
      return
    }

    for (const dependent of dependents) {
      const dependentPackage = packages[dependent.name]
      const dependentConfig = compileBumpConfig(rootConfig, dependentPackage.json.auto?.bump)
      let bumpedRange = null
      let bumpedDevRange = null
      let bumpedVersion = null

      if (dependent.range !== null) {
        // if bumped range is different from the range from stack (existing or not) then bump
        bumpedRange = bumpRange(dependent.range, version, type, pkgConfig)

        // skip dependent if we shouldn't always bump a version and it satisfies the bump
        if (bumpedRange === dependent.range) {
          continue
        }

        bumpedVersion = bumpVersion(dependentPackage.json.version, resolvedType, dependentConfig)
      }

      if (dependent.devRange !== null) {
        bumpedDevRange = bumpRange(dependent.devRange, version, type, pkgConfig)

        // skip dependent if we shouldn't always bump a version and it satisfies the bump
        if (bumpedDevRange === dependent.devRange && bumpedVersion === null) {
          continue
        }
      }

      let dependentPrevType: TBumpType | null = null

      if (Reflect.has(bumpStack, dependent.name)) {
        const bumpStackItem = bumpStack[dependent.name]

        dependentPrevType = bumpStackItem.type

        if (bumpedVersion !== null && compareReleaseTypes(dependentPrevType, resolvedType) < 0) {
          bumpStackItem.version = bumpedVersion
          bumpStackItem.type = resolvedType
        }

        if (bumpedRange !== null) {
          bumpStackItem.deps = {
            ...bumpStackItem.deps,
            [name]: bumpedRange,
          }
        }

        if (bumpedDevRange !== null) {
          bumpStackItem.devDeps = {
            ...bumpStackItem.devDeps,
            [name]: bumpedDevRange,
          }
        }
      } else {
        bumpStack[dependent.name] = {
          name: dependent.name,
          dir: dependentPackage.dir,
          version: null,
          type: null,
          deps: null,
          devDeps: null,
        }

        if (bumpedVersion !== null) {
          bumpStack[dependent.name].version = bumpedVersion
          bumpStack[dependent.name].type = resolvedType
        }

        if (bumpedRange !== null) {
          bumpStack[dependent.name].deps = {
            ...bumpStack[dependent.name].deps,
            [name]: bumpedRange,
          }
        }

        if (bumpedDevRange !== null) {
          bumpStack[dependent.name].devDeps = {
            ...bumpStack[dependent.name].devDeps,
            [name]: bumpedDevRange,
          }
        }
      }

      if (bumpedVersion !== null && compareReleaseTypes(dependentPrevType, resolvedType) < 0) {
        bumpDependents(dependent.name, dependentPackage.json.version, resolvedType, dependentConfig)
      }
    }
  }

  for (const bump of bumps) {
    const packageItem = packages[bump.name]
    const packageConfig = compileBumpConfig(rootConfig, packageItem.json.auto?.bump)
    const releaseType = getCommonBumpType(bump)

    if (Reflect.has(bumpStack, bump.name)) {
      const bumpStackItem = bumpStack[bump.name]

      // if there was already a bump greater or equal than the current
      // then do nothing
      if (compareReleaseTypes(bumpStackItem.type, releaseType) >= 0) {
        continue
      }

      bumpStack[bump.name] = {
        ...bumpStackItem,
        version: bumpVersion(packageItem.json.version, releaseType, packageConfig),
        type: releaseType,
      }
    } else {
      bumpStack[bump.name] = {
        name: bump.name,
        dir: packageItem.dir,
        version: bumpVersion(packageItem.json.version, releaseType, packageConfig),
        type: releaseType,
        deps: null,
        devDeps: null,
      }
    }
  }

  const stackKeys = Object.keys(bumpStack)
    .sort((a, b) => compareReleaseTypes(bumpStack[a].type, bumpStack[b].type))

  for (const stackName of stackKeys) {
    const packageItem = packages[stackName]
    const stackItem = bumpStack[stackName]
    const packageConfig = compileBumpConfig(rootConfig, packageItem.json.auto?.bump)

    bumpDependents(stackName, packageItem.json.version, stackItem.type!, packageConfig)
  }

  return Object.values(bumpStack)
    .sort((a, b) => getDependentsCount(a) - getDependentsCount(b))
}
