import { ReactElement } from 'react' // eslint-disable-line
import { TResult } from '@x-ray/common-utils'
import { TLineElement } from 'syntx'
import { TAnyObject } from 'tsfn'

export type TMeta = {
  id: string,
  serializedElement: TLineElement[][],
  element: ReactElement<any>,
  options: {
    hasOwnWidth?: boolean,
    negativeOverflow?: number,
    backgroundColor?: string,
    maxWidth?: number,
  },
}

export type TCheckResult =
  {
    type: 'OK',
  } |
  {
    type: 'DIFF',
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
    data: Buffer,
    width: number,
    height: number,
  } |
  {
    type: 'DELETED',
    data: Buffer,
    width: number,
    height: number,
  }

export type TItemResult =
{
  id: string,
  serializedElement: TAnyObject,
} &
  (TCheckResult |
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
  })

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
