import React, { FC, Fragment } from 'react'
import { isUndefined } from 'tsfn'
import { TResult } from '@x-ray/common-utils'
import { File } from './File'
import { Block } from './Block'
import { TRect } from './types'

export type TList = {
  title: string,
  list: string[],
  files: TResult,
  kind: 'image' | 'text',
  onClick: (file: string) => void,
} & TRect

export const List: FC<TList> = ({
  title,
  files,
  list,
  kind,
  top,
  left,
  width,
  height,
  onClick,
}) => (
  <Block top={top} left={left} width={width} height={height}>
    <h2>{title}:</h2>

    {list.length > 0 && !isUndefined(kind) &&
      list
        .map((file) => {
          const data = files[file]

          return (
            <div key={file}>
              <div>
                <div>
                  <h3 key={file} onClick={() => onClick(file)}>{file}</h3>
                </div>
                {data.new.length > 0 && (
                  <div>
                    <h4 key={`${file}:new`}>new: {data.new.length}</h4>
                    {data.new.map((item) => (
                      <div key={`${file}:new:${item}`}>
                        <h4>{item}</h4>
                        <File
                          kind={kind}
                          type="new"
                          file={file}
                          item={item}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {data.diff.length > 0 && (
                <Fragment>
                  <h4 key={`${file}:diff`}>diff: {data.diff.length}</h4>
                  {data.diff.map((item) => (
                    <div key={`${file}:diff:${item}`}>
                      <h5>{item}</h5>
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
                  ))}
                </Fragment>
              )}

              {data.deleted.length > 0 && (
                <Fragment>
                  <h4 key={`${file}:deleted`}>deleted: {data.deleted.length}</h4>
                  {data.deleted.map((item) => (
                    <div key={`${file}:deleted:${item}`}>
                      <h5>{item}</h5>
                      <File
                        kind={kind}
                        type="old"
                        file={file}
                        item={item}
                      />
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          )
        })
      }
  </Block>
)
