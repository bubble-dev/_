import React from 'react'
import { startWithType, component, mapState, onMount, mapHandlers } from 'refun'
import { loadScreenshotApi, TLoadScreenshotApiOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { errorAction } from '../actions'

type TScreenshotState = {
  src: string,
  width: number,
  height: number,
} | null

export const Screenshot = component(
  startWithType<TLoadScreenshotApiOpts>(),
  mapStoreDispatch,
  mapState('state', 'setState', () => null as TScreenshotState, []),
  onMount(({ setState, file, item, type, dispatch }) => {
    (async () => {
      try {
        const { url, width, height, dpr } = await loadScreenshotApi({ file, item, type })

        setState({
          src: url,
          width: width / dpr,
          height: height / dpr,
        })
      } catch (err) {
        dispatch(errorAction(err.message))
      }
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
