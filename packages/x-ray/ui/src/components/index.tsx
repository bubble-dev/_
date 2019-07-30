import React from 'react'
import { component, onMount, startWithType, mapHandlers } from 'refun'
import { Root } from '@primitives/root'
import { Layout, LayoutInFlow } from '@primitives/layout'
import { isUndefined } from 'tsfn'
import { mapStoreState, mapStoreDispatch } from '../store'
import { loadListAction, saveAction } from '../actions'
import { File } from './File'

export const Index = component(
  startWithType<{}>(),
  mapStoreState(({ kind, files }) => ({
    kind,
    files,
  }), ['kind', 'files']),
  mapStoreDispatch,
  onMount(({ dispatch }) => {
    dispatch(loadListAction())
  }),
  mapHandlers({
    onSave: ({ dispatch }) => () => {
      dispatch(saveAction())
    },
  })
)(({ kind, files, onSave }) => (
  <Root>
    {(/*{ width, height }*/) => (
      <Layout direction="vertical">
        {!isUndefined(files) && !isUndefined(kind) &&
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
                      <File
                        kind={kind}
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
                        kind={kind}
                        type="old"
                        file={file}
                        item={item}
                      />
                      <File
                        kind={kind}
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
                        kind={kind}
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
            .map((item, key) => (
              <LayoutInFlow key={key}>{item}</LayoutInFlow>
            ))
          }
        <LayoutInFlow>
          <button onClick={onSave}>save</button>
        </LayoutInFlow>
      </Layout>
    )}
  </Root>
))
