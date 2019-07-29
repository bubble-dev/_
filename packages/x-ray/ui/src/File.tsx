import React, { FC } from 'react'
import { TFile } from './types'
import { Screenshot } from './Screenshot'
import { Snapshot } from './Snapshot'

export const File: FC<TFile> = (props) => (
  props.kind === 'image'
    ? (
      <Screenshot {...props}/>
    )
    : (
      <Snapshot {...props}/>
    )
)
