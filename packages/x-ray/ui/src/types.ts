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

export type TItemType = 'new' | 'deleted' | 'diff'

export type TItem = TSize & {
  file: string,
  id: string,
  serializedElement: TLineElement[][],
}

export type TScreenshotItem = TItem & ({
  type: 'new' | 'deleted',
} | {
  type: 'diff',
  newWidth: number,
  newHeight: number,
})

export type TSnapshotItem = TItem & {
  type: 'new' | 'deleted' | 'diff',
}

export type TGridItem = TItem & TPosition & {
  gridWidth: number,
  gridHeight: number,
}

export type TScreenshotGridItem = TScreenshotItem & TGridItem

export type TSnapshotGridItem = TSnapshotItem & TGridItem

export type TState = {
  error?: string,
  isSaved: boolean,
  isLoading: boolean,
} & ({
  type?: 'text',
  items?: TSnapshotItem[],
  selectedItem: TSnapshotGridItem | null,
} | {
  type?: 'image',
  items?: TScreenshotItem[],
  selectedItem: TScreenshotGridItem | null,
})
