import React from 'react'
import { startWithType, component, mapState, onMount, mapHandlers } from 'refun'

const ENDPOINT = 'http://localhost:3001/get'

export type TImage = {
  file: string,
  type: string,
  item: string,
}

type TImageState = {
  src: string,
  width: number,
  height: number,
} | null

export const Image = component(
  startWithType<TImage>(),
  mapState('state', 'setState', () => null as TImageState, []),
  onMount(({ setState, file, item, type }) => {
    (async () => {
      const response = await fetch(`${ENDPOINT}?file=${encodeURIComponent(file)}&type=${type}&item=${encodeURIComponent(item)}`)
      const width = Number(response.headers.get('x-ray-width'))
      const height = Number(response.headers.get('x-ray-height'))
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setState({
        src: url,
        width: width / 2,
        height: height / 2,
      })
    })()
  }),
  mapHandlers({
    onLoad: ({ state }) => () => URL.revokeObjectURL(state!.src),
  })
)(({ state, onLoad }) => (
  state === null
    ? null
    : (
      <img
        style={{
          border: '1px solid red',
          width: state.width,
          height: state.height,
        }}
        src={state.src}
        onLoad={onLoad}
      />
    )
))
