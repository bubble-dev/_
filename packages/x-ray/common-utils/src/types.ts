import { TAnyObject } from 'tsfn'

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
  old: {
    [k: string]: {
      serializedElement: TAnyObject,
      width: number,
      height: number,
    },
  },
  new: {
    [k: string]: {
      serializedElement: TAnyObject,
      width: number,
      height: number,
    },
  },
}

export type TResult = { [filename: string]: TFileResult }
