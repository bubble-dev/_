import { ReactElement } from 'react'
import { TLineElement } from 'syntx'
import { TAnyObject } from 'tsfn'

export type TMeta = {
  id: string,
  serializedElement: TLineElement[][],
  element: ReactElement<any>,
}

export type TCheckResult =
  {
    type: 'OK',
  } |
  {
    type: 'DIFF',
    oldData: Buffer,
    newData: Buffer,
  } |
  {
    type: 'NEW',
    data: Buffer,
  } |
  {
    type: 'DELETED',
    data: Buffer,
  }

export type TItemResult =
  (TCheckResult & {
    id: string,
    serializedElement: TAnyObject,
  }) |
  {
    type: 'DONE',
    path: string,
  } |
  {
    type: 'ERROR',
    data: string,
  } |
  {
    type: 'BAILOUT',
    id: string,
  }

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
  diff: {
    [k: string]: {
      serializedElement: TAnyObject,
      width: number,
      height: number,
    },
  },
}

export type TResult = {
  [filename: string]: TFileResult,
}

export type TFileResultLine = {
  value: string,
  type?: 'added' | 'removed',
}

export type TFileResultData = {
  old: {
    [key: string]: TFileResultLine[],
  },
  new: {
    [key: string]: TFileResultLine[],
  },
  diff: {
    [key: string]: TFileResultLine[],
  },
}

export type TResultData = { [key: string]: TFileResultData }

export type TRunSnapshotsResult = {
  result: TResult,
  resultData: TResultData,
  hasBeenChanged: boolean,
}

export type TSnapshotsListResult = {
  type: 'text',
  files: TResult,
}
