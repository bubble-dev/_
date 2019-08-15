import { TJsonValue } from 'typeon'
import { TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'
import { TLineElement } from 'syntx'

export type TPosition = {
  top: number,
  left: number,
}

export type TSize = {
  width: number,
  height: number,
}

export type TRect = TPosition & TSize

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

export type TItemType = 'new' | 'deleted' | 'diff'

export type TItem = TSize & {
  file: string,
  id: string,
  serializedElement: TLineElement[][],
} & ({
  type: 'new' | 'deleted',
} | {
  type: 'diff',
  newWidth: number,
  newHeight: number,
})

export type TGridItem = TItem & TPosition & {
  gridWidth: number,
  gridHeight: number,
}

export type TState = {
  error?: string,
  isSaved: boolean,
  isLoading: boolean,
  selectedItem: TGridItem | null,
  items?: TItem[],
  type?: TType,
}
