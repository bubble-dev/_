import React, { FC } from 'react'
import { Screenshot } from './Screenshot'
import { Snapshot } from './Snapshot'
import { TFile } from './types'

export const File: FC<TFile> = (props) => (
  props.kind === 'image'
    ? (
      <Screenshot {...props}/>
    )
    : (
      <Snapshot {...props}/>
    )
)
