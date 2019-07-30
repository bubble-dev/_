import React, { FC } from 'react'
import { Screenshot } from './Screenshot'
import { Snapshot } from './Snapshot'

export type TFile = {
  kind: 'image' | 'text',
  file: string,
  type: string,
  item: string,
}

export const File: FC<TFile> = ({ kind, ...props }) => (
  kind === 'image'
    ? (
      <Screenshot {...props}/>
    )
    : (
      <Snapshot {...props}/>
    )
)
