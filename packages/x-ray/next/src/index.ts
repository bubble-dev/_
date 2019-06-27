import { createReadStream, createWriteStream } from 'graceful-fs'
import tarStream from 'tar-stream'

export type TTarFs = {
  list: () => Iterable<string>,
  read: (filePath: string) => Buffer,
  write: (filePath: string, data: Buffer) => void,
  close: () => Promise<void>,
}

export const TarFs = (tarFilePath: string) => new Promise<TTarFs>((resolve, reject) => {
  const extract = tarStream.extract()
  const files = new Map<string, Buffer>()
  let hasChanged = false

  const api: TTarFs = {
    list: () => files.keys(),
    read: (filePath) => {
      if (!files.has(filePath)) {
        throw new Error(`File ${filePath} doesn't exist`)
      }

      return files.get(filePath)!
    },
    write: (filePath, data) => {
      hasChanged = true

      files.set(filePath, data)
    },
    close: () => new Promise((writeResolve, writeReject) => {
      if (!hasChanged) {
        return writeResolve()
      }

      const writeStream = createWriteStream(tarFilePath)
      const pack = tarStream.pack()

      for (const [name, data] of files.entries()) {
        pack.entry({ name }, data)
      }

      pack.finalize()

      pack.on('error', writeReject)
      writeStream.on('error', writeReject)
      writeStream.on('finish', writeResolve)

      pack.pipe(writeStream)
    }),
  }

  extract.on('entry', (header, stream, next) => {
    let data = Buffer.from([])

    stream.on('data', (chunk) => {
      data = Buffer.concat([data, chunk])
    })

    stream.on('end', () => {
      files.set(header.name, data)

      next()
    })
  })

  extract.on('finish', () => resolve(api))

  extract.on('error', reject)

  createReadStream(tarFilePath)
    .on('error', (error) => {
      if (error.code === 'ENOENT') {
        resolve(api)
      } else {
        reject(error)
      }
    })
    .pipe(extract)
})
