import React from 'react'
import { startWithType, component, mapState, onMount, mapHandlers } from 'refun'
import { apiLoadScreenshot, TApiLoadScreenshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { Block } from './Block'

type TScreenshotState = {
  src: string,
  width: number,
  height: number,
} | null

export type TScreenshot = TApiLoadScreenshotOpts & {
  top: number,
  left: number,
}

export const Screenshot = component(
  startWithType<TScreenshot>(),
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
)(({ state, top, left, onLoad }) => {
  if (state === null) {
    return null
  }

  return (
    <Block
      top={top - state.height / 2}
      left={left - state.width / 2}
      width={state.width}
      height={state.height}
    >
      <img
        style={{
          border: '1px solid red',
          width: state.width,
          height: state.height,
        }}
        src={state.src}
        onLoad={onLoad}
      />
    </Block>
  )
})
