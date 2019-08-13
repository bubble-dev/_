import { TState, TItemType } from '../types'

const TYPES: TItemType[] = ['new', 'new', 'new', 'new', 'diff', 'deleted', 'deleted', 'deleted', 'deleted', 'deleted', 'deleted']

const randomSize = () => Math.floor(Math.random() * 10) * 10 + 50

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
          width: randomSize(),
          height: randomSize(),
          newWidth: randomSize(),
          newHeight: randomSize(),
        }
      }

      return {
        type,
        file: '',
        props: '',
        width: randomSize(),
        height: randomSize(),
      }
    }),
  type: 'image',
}
