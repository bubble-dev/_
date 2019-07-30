import React from 'react'
import { startWithType, component, mapState, onMount, mapHandlers } from 'refun'
import { TFile } from './types'

const ENDPOINT = 'http://localhost:3001/get'

type TScreenshotState = {
  src: string,
  width: number,
  height: number,
} | null

export const Screenshot = component(
  startWithType<TFile>(),
  mapState('state', 'setState', () => null as TScreenshotState, []),
  onMount(({ setState, file, item, type }) => {
    (async () => {
      const response = await fetch(`${ENDPOINT}?file=${encodeURIComponent(file)}&type=${type}&item=${encodeURIComponent(item)}`)
      const width = Number(response.headers.get('x-ray-width'))
      const height = Number(response.headers.get('x-ray-height'))
      const dpr = Number(response.headers.get('x-ray-dpr'))
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setState({
        src: url,
        width: width / dpr,
        height: height / dpr,
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
