import { ReactElement } from 'react'
import { TResult } from '@x-ray/common-utils'
import { TLineElement } from 'syntx'

export type TMeta = {
  id: string,
  serializedElement: TLineElement[][],
  element: ReactElement<any>,
}

export type TCheckResult =
  {
    type: 'OK',
    path: string,
  } |
  {
    type: 'DIFF',
    path: string,
    oldData: Buffer,
    newData: Buffer,
  } |
  {
    type: 'NEW',
    path: string,
    data: Buffer,
  } |
  {
    type: 'DELETED',
    path: string,
    data: Buffer,
  }

export type TItemResult =
  TCheckResult |
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
    path: string,
  }

export type TFileResultData = {
  old: {
    [key: string]: Buffer,
  },
  new: {
    [key: string]: Buffer,
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
