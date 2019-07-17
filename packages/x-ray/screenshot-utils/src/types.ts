import { ReactElement } from 'react' // eslint-disable-line

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
