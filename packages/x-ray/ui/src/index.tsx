import React from 'react'
import { component, onMount, startWithType, mapState, mapHandlers } from 'refun'

export const App = component(
  startWithType<{}>(),
  mapState('state', 'setState', () => null, []),
  onMount(({ setState }) => {
    (async () => {
      const response = await fetch('http://localhost:3001/get?file=%2FUsers%2Falex.feinstein%2Fdev%2Fbubble-dev%2Fpackages%2Fprimitives%2Finput%2Ftest%2Fscreenshots.tsx&type=new&item=value%3Dfoo.png')
      const width = Number(response.headers.get('x-ray-width'))
      const height = Number(response.headers.get('x-ray-height'))

      console.log(width, height)

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
    onLoad: ({ state }) => () => URL.revokeObjectURL(state.src),
  })
)(({ state, onLoad }) => (
  state === null
    ? null
    : (
      <img style={{ width: state.width, height: state.height }} src={state.src} onLoad={onLoad}/>
    )
))
