import { ReactElement } from 'react'
import { TResult } from '@x-ray/common-utils'

export type TMeta = {
  options: {
    name: string,
  },
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
