import { FC } from 'react'
import { TCommonComponentConfig } from 'autoprops'
import { TAnyObject } from 'tsfn'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { TComponents, TPackageJson } from '../types'

export type TMetaState = {
  components: TComponents | null,
  // Key - Index group
  componentKey: string | null, // Key value
  propsIndex: string,
  selectedElementPath: string,
  // component group, depends on 'components' and 'componentKey'
  componentConfig: TCommonComponentConfig | null,
  Component: FC<any> | null,
  componentProps: Readonly<TAnyObject>,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  // packageJson group
  packageJson: TPackageJson | null,
}

export type TMetaDispatch = ThunkDispatch<TMetaState, undefined, AnyAction>
