import { ReactElement } from 'react' // eslint-disable-line
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

export type TScreenshotsCheckResult =
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

export type TScreenshotResultType = 'old' | 'new'

export type TScreenshotsFileResult = {
  [k in TScreenshotResultType]: {
    [k: string]: {
      serializedElement: TAnyObject,
      width: number,
      height: number,
    },
  }
}

export type TScreenshotsResult = {
  [filename: string]: TScreenshotsFileResult,
}

export type TScreenshotsItemResult =
  (TScreenshotsCheckResult & {
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

export type TScreenshotsFileResultData = {
  [k in TScreenshotResultType]: {
    [key: string]: Buffer,
  }
}

export type TScreenshotsResultData = { [key: string]: TScreenshotsFileResultData }

export type TRunScreesnotsResult = {
  result: TScreenshotsResult,
  resultData: TScreenshotsResultData,
  hasBeenChanged: boolean,
}

export type TScreenshotsListResult = {
  type: 'image',
  files: TScreenshotsResult,
}
