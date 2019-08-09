import { TJsonValue } from 'typeon'
import { TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'
import { TResult } from '@x-ray/common-utils'
import { TRect } from './components/types'

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: string,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TExtend<TAnyAction, { type: T }>
export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>
export type TActionAsync<A extends TAnyAction> = ThunkAction<Promise<void>, TState, any, A>

export type TType = 'image' | 'text'

export type TFileType = 'old' | 'new'

export type TItemType = 'new' | 'diff' | 'deleted'

// export type TItem = {
//   file: string,
//   type: TItemType,
//   props: string,
// }

export type TItem = TRect

export type TState = {
  type?: TType,
  files?: TResult,
  isSaved: boolean,
  isLoading: boolean,
  selectedItem?: TItem,
  error?: string,
}
