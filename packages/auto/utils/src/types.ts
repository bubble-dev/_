import { TJsonMap } from 'typeon'

export type TResolvedBumpType = 'major' | 'minor' | 'patch'

export type TPrefix = {
  title: string,
  value: string,
}

export type TPrefixes = {
  required: {
    major: TPrefix,
    minor: TPrefix,
    patch: TPrefix,
    publish: TPrefix,
    dependencies: TPrefix,
    initial: TPrefix,
  },
  custom: TPrefix[],
}

export type TBumpConfig = {
  initialType?: TResolvedBumpType,
  zeroBreakingChangeType?: TResolvedBumpType,
  shouldAlwaysBumpDependents?: boolean,
}

export type TNpmConfig = {
  registry?: string,
  publishSubDirectory?: string,
  access?: 'restricted' | 'public',
}

export type TAutoConfig = {
  bump?: TBumpConfig,
  npm?: TNpmConfig,
}

export type TPackageJson = {
  name: string,
  version: string,
  dependencies?: {
    [k: string]: string,
  },
  devDependencies?: {
    [k: string]: string,
  },
  peerDependencies?: {
    [k: string]: string,
  },
  workspaces?: string[] | {
    packages: string[],
  },
  publishConfig?: {
    registry?: string,
  },
  auto?: TAutoConfig,
} & TJsonMap

export type TPackages = {
  [name: string]: {
    dir: string,
    json: TPackageJson,
  },
}

export type TBumpType = TResolvedBumpType | 'initial'

export type TGitMessage = {
  type: TBumpType,
  value: string,
  description?: string,
}

export type TGitBump = {
  name: string,
  messages: TGitMessage[],
}

export type TPackageBump = {
  name: string,
  type: TBumpType | null,
  version: string | null,
  dir: string,
  deps: {
    [name: string]: string,
  } | null,
  devDeps: {
    [name: string]: string,
  } | null,
}

export type TPrompt = {
  title: string,
  value: string,
}
