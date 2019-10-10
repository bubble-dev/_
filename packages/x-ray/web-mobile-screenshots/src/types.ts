import { TLineElement } from 'syntx'

export type TOptions = {
  platform: 'ios-web' | 'android-web',
  dpr: number,
  extensions: string[],
  entryPointField: string,
}

export type TChildOptions = {
  targetFiles: string[],
}

export type TWorkerDone = {
  type: 'DONE',
}

export type TWorkerError = {
  type: 'ERROR',
  data: string,
}

export type TWorkerHtmlResult = {
  type: 'NEXT',
  id: string,
  serializedElement: TLineElement[][],
  path: string,
  html: string,
}

export type TWorkerResult = TWorkerDone | TWorkerError | TWorkerHtmlResult