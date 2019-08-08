import { ReactElement } from 'react' // eslint-disable-line
import { TResult } from '@x-ray/common-utils'

export type TMeta = {
  options: {
    name: string,
    hasOwnWidth?: boolean,
    negativeOverflow?: number,
    backgroundColor?: string,
    maxWidth?: number,
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
    old: {
      data: Buffer,
      width: number,
      height: number,
    },
    new: {
      data: Buffer,
      width: number,
      height: number,
    },
  } |
  {
    type: 'NEW',
    path: string,
    data: Buffer,
    width: number,
    height: number,
  } |
  {
    type: 'DELETED',
    path: string,
    data: Buffer,
    width: number,
    height: number,
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

export type TRunScreesnotsResult = {
  result: TResult,
  resultData: TResultData,
  hasBeenChanged: boolean,
}

export type TScreenshotsListResult = {
  type: 'image',
  files: TResult,
}
