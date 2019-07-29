export type TCheckRequest = { type: 'FILE', path: string } | { type: 'DONE' }

export type TOptions = {
  mocks?: {
    [k: string]: string,
  },
  extensions: string[],
  platform: string,
}

export type TFileResultType = 'ok' | 'diff' | 'new' | 'deleted'

export type TFileResult = {
  [key in TFileResultType]: string[]
}

export type TResult = { [key: string]: TFileResult }

export type TServerResult = {
  kind: 'image' | 'text',
  files: TResult,
}
