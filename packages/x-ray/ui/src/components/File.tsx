import React, { FC } from 'react'
import { TKind, TFileType } from '../types'
import { Screenshot } from './Screenshot'
import { Snapshot } from './Snapshot'

export type TFile = {
  kind: TKind,
  file: string,
  type: TFileType,
  item: string,
  top: number,
  left: number,
}

export const File: FC<TFile> = ({ kind, ...props }) => (
  kind === 'image'
    ? <Screenshot {...props}/>
    : <Snapshot {...props}/>
)
