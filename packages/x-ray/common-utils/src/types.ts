export type TMessageStatus = 'ok' | 'diff' | 'new' | 'unknown'

export type TMessage = {
  status: TMessageStatus,
  path: string,
}

export type TCheckRequest = { type: 'FILE', path: string } | { type: 'DONE' }

export type TCheckResult = {
  type: 'OK' | 'DIFF' | 'NEW' | 'BAILOUT',
  path: string,
  data?: Buffer,
}

export type TItemResult = TCheckResult | { type: 'DONE', path: string } | { type: 'ERROR', data: string }

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
