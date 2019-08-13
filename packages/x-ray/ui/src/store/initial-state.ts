import { TState, TItemType } from '../types'

const TYPES: TItemType[] = ['new', 'new', 'new', 'new', 'diff', 'deleted', 'deleted', 'deleted', 'deleted', 'deleted', 'deleted']

export const initialState: TState = {
  isSaved: false,
  isLoading: false,
  selectedItem: null,
  items: new Array(10000)
    .fill(0)
    .map(() => {
      const type = TYPES[Math.round(Math.random() * (TYPES.length - 1))]

      if (type === 'diff') {
        return {
          type,
          file: '',
          props: '',
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 100,
          newWidth: Math.random() * 100 + 50,
          newHeight: Math.random() * 100 + 100,
        }
      }

      return {
        type,
        file: '',
        props: '',
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 100,
      }
    }),
}
