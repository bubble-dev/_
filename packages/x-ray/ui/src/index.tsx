import React from 'react'
import { component, onMount, startWithType, mapState, mapHandlers } from 'refun'
import { TResult } from '@x-ray/chrome-screenshots'
import { Image } from './Image'

const HOST = 'localhost'
const PORT = 3001

export const App = component(
  startWithType<{}>(),
  mapState('files', 'setFiles', () => ({}) as TResult, []),
  onMount(({ setFiles }) => {
    (async () => {
      const filesResponse = await fetch(`http://${HOST}:${PORT}/list`)
      const files = await filesResponse.json() as TResult

      console.log('files', files)

      setFiles(files)
    })()
  }),
  mapHandlers({
    onSave: () => async () => {
      await fetch(`http://${HOST}:${PORT}/save`, { method: 'POST' })
    },
  })
)(({ files, onSave }) => (
  <div>
    <div>
      {
        Object
          .entries(files)
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
                    <Image
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
                ...data.new.map((item) => (
                  <div key={`${file}:diff:${item}`}>
                    <h4>{item}</h4>
                    <Image
                      type="old"
                      file={file}
                      item={item}
                    />
                    <Image
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
                  <h3 key={`${file}:deleted`}>deleted: {data.deleted.length}</h3>
                ),
                ...data.new.map((item) => (
                  <div key={`${file}:deleted:${item}`}>
                    <h4>{item}</h4>
                    <Image
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
