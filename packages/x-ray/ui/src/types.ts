import { TJsonValue } from 'typeon'
import { TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'
import { TResult } from '@x-ray/common-utils'

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: string,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TExtend<TAnyAction, { type: T }>
export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>
export type TActionAsync<A extends TAnyAction> = ThunkAction<Promise<void>, TState, any, A>

export type TKind = 'image' | 'text'

export type TFileType = 'old' | 'new'

export type TResultType = 'new' | 'diff' | 'deleted'

export type TState = {
  kind?: TKind,
  files?: TResult,
  isSaved: boolean,
  isLoading: boolean,
  stagedList: TResult,
  unstagedList: TResult,
  selectedFile?: string,
  selectedItem?: string,
  selectedType?: TResultType,
  error?: string,
}
