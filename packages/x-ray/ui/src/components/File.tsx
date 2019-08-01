import React, { FC } from 'react'
import { TKind } from '../types'
import { Screenshot } from './Screenshot'
import { Snapshot } from './Snapshot'

export type TFile = {
  kind: TKind,
  file: string,
  type: string,
  item: string,
}

export const File: FC<TFile> = ({ kind, ...props }) => (
  kind === 'image'
    ? <Screenshot {...props}/>
    : <Snapshot {...props}/>
)
