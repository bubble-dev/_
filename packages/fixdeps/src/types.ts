export type TDepsEntries = [string, string][]

export type TDepsObject = {[k: string]: string}

export type TOptions = {
  packagePath: string,
  dependencyFilesGlobs: string[],
  devDependencyFilesGlobs: string[],
  ignoredPackages?: string[],
}
