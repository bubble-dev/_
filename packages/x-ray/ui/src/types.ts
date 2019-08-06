import { TJsonValue } from 'typeon'
import { TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'

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

export type TItemType = 'new' | 'diff' | 'deleted'

export type TItem = {
  file: string,
  type: TItemType,
  props: string,
}

export type TState = {
  kind?: TKind,
  isSaved: boolean,
  isLoading: boolean,
  itemsToStage: TItem[],
  itemsToUnstage: TItem[],
  stagedItems: TItem[],
  unstagedItems: TItem[],
  selectedItem?: TItem,
  error?: string,
}
