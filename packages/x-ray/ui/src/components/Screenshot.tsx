import React from 'react'
import { startWithType, component, mapState, onMount, mapHandlers } from 'refun'
import { apiLoadScreenshot, TApiLoadScreenshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'

type TScreenshotState = {
  src: string,
  width: number,
  height: number,
} | null

export const Screenshot = component(
  startWithType<TApiLoadScreenshotOpts>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TScreenshotState, []),
  onMount(({ setState, file, item, type, dispatch }) => {
    (async () => {
      try {
        const { blob, width, height, dpr } = await apiLoadScreenshot({ file, item, type })
        const url = URL.createObjectURL(blob)

        setState({
          src: url,
          width: width / dpr,
          height: height / dpr,
        })
      } catch (err) {
        dispatch(actionError(err.message))
      }
    })()
  }),
  mapHandlers({
    onLoad: ({ state }) => () => {
      URL.revokeObjectURL(state!.src)
    },
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
