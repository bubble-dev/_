export type TMessageStatus = 'ok' | 'diff' | 'new' | 'unknown'

export type TMessage = {
  status: TMessageStatus,
  path: string,
}

export type TCheckRequest = { type: 'FILE', path: string } | { type: 'DONE' }

export type TTotalResult = {
  ok: number,
  diff: number,
  new: number,
}

export type TOptions = {
  mocks?: {
    [k: string]: string,
  },
  extensions: string[],
  platform: string,
}
