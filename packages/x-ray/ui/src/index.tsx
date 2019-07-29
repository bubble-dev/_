import React from 'react'
import { component, onMount, startWithType, mapState, mapHandlers } from 'refun'
import { TServerResult } from '@x-ray/common-utils'
import { File } from './File'

const HOST = 'localhost'
const PORT = 3001

export const App = component(
  startWithType<{}>(),
  mapState('state', 'setState', () => null as TServerResult | null, []),
  onMount(({ setState }) => {
    (async () => {
      const filesResponse = await fetch(`http://${HOST}:${PORT}/list`)
      const result = await filesResponse.json() as TServerResult

      console.log('files', result.files)

      setState(result)
    })()
  }),
  mapHandlers({
    onSave: () => async () => {
      await fetch(`http://${HOST}:${PORT}/save`, { method: 'POST' })
    },
  })
)(({ state, onSave }) => (
  <div>
    <div>
      {state &&
        Object
          .entries(state.files)
          .reduce((result, [file, data]) => {
            result.push(
              <h2 key={file}>{file}</h2>
            )

            if (data.ok.length > 0) {
              result.push(
                <h3 key={`${file}:ok`}>ok: {data.ok.length}</h3>
              )
            }

            if (data.new.length > 0) {
              result.push(
                (
                  <h3 key={`${file}:new`}>new: {data.new.length}</h3>
                ),
                ...data.new.map((item) => (
                  <div key={`${file}:new:${item}`}>
                    <h4>{item}</h4>
                    <File
                      kind={state.kind}
                      type="new"
                      file={file}
                      item={item}
                    />
                  </div>
                ))
              )
            }

            if (data.diff.length > 0) {
              result.push(
                (
                  <h3 key={`${file}:diff`}>diff: {data.diff.length}</h3>
                ),
                ...data.diff.map((item) => (
                  <div key={`${file}:diff:${item}`}>
                    <h4>{item}</h4>
                    <File
                      kind={state.kind}
                      type="old"
                      file={file}
                      item={item}
                    />
                    <File
                      kind={state.kind}
                      type="new"
                      file={file}
                      item={item}
                    />
                  </div>
                ))
              )
            }

            if (data.deleted.length > 0) {
              result.push(
                (
                  <h3 key={`${file}:deleted`}>deleted: {data.deleted.length}</h3>
                ),
                ...data.deleted.map((item) => (
                  <div key={`${file}:deleted:${item}`}>
                    <h4>{item}</h4>
                    <File
                      kind={state.kind}
                      type="old"
                      file={file}
                      item={item}
                    />
                  </div>
                ))
              )
            }

            return result
          }, [] as any[])
      }
    </div>
    <hr/>
    <button onClick={onSave}>save</button>
  </div>
))
