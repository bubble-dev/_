/* eslint-disable import/no-named-as-default-member */
import fs from 'pifs'

const HEADER_SIZE = 512

const chksum = (block: Buffer): number => {
  let sum = 8 * 32

  for (let i = 0; i < 148; i++) {
    sum += block[i]
  }

  for (let j = 156; j < HEADER_SIZE; j++) {
    sum += block[j]
  }

  return sum
}

const trimBufferString = (str: string): string => {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 0) {
      return str.substr(0, i)
    }
  }

  return str
}

const encodeOct = (val: number, n: number): string => {
  const valStr = val.toString(8)

  if (valStr.length > n) {
    throw new Error('Encoded value length is greater than requested space')
  }

  return `${valStr.padStart(n, '0')} `
}

// https://www.gnu.org/software/tar/manual/html_node/Standard.html
const generateHeader = (name: string, size: number): Buffer => {
  const buf = Buffer.alloc(HEADER_SIZE)

  buf.write(name)
  // mode
  buf.write(encodeOct(0o644, 6), 100)
  // uid
  buf.write(encodeOct(0, 6), 108)
  // gid
  buf.write(encodeOct(0, 6), 116)
  // size
  buf.write(encodeOct(size, 11), 124)
  // mtime
  buf.write(encodeOct(Math.floor(Date.now() / 1000), 11), 136)
  // typeflag
  buf.write('0', 156)
  // linkname
  // magic (indicates that this archive was output in the P1003 archive format)
  buf.write('ustar', 257)
  // version
  buf.write(encodeOct(0, 2), 263)
  // uname
  // gname
  // devmajor
  buf.write(encodeOct(0, 6), 329)
  // devminor
  buf.write(encodeOct(0, 6), 337)

  // chksum
  buf.write(encodeOct(chksum(buf), 6), 148)

  return buf
}

type TFileMeta = {
  position: number,
  size: number,
}

export type TTarFs = {
  has: (filePath: string) => boolean,
  list: () => string[],
  read: (filePath: string) => Promise<Buffer | null>,
  delete: (filePath: string) => void,
  write: (filePath: string, data: Buffer) => void,
  save: () => Promise<void>,
  close: () => Promise<void>,
}

export const TarFs = async (tarFilePath: string): Promise<TTarFs> => {
  let fd: number | null = null
  const files = new Map<string, TFileMeta>()
  const filesToWrite = new Map<string, Buffer>()
  const filesToDelete = new Set<string>()
  let pos = 0
  const nameBuffer = Buffer.alloc(100)
  const sizeBuffer = Buffer.alloc(12)

  try {
    fd = await fs.open(tarFilePath, 'r')

    while (true) {
      await fs.read(fd, nameBuffer, 0, 100, pos)

      const name = trimBufferString(nameBuffer.toString())

      if (name.length === 0) {
        break
      }

      await fs.read(fd, sizeBuffer, 0, 12, pos + 124)

      const dataSize = parseInt(sizeBuffer.toString(), 8)

      files.set(name, {
        position: pos + HEADER_SIZE,
        size: dataSize,
      })

      pos += HEADER_SIZE + dataSize + (HEADER_SIZE - dataSize % HEADER_SIZE)
    }
  } catch {} //eslint-disable-line

  return {
    has: (filePath): boolean => files.has(filePath),
    list: () => {
      const tempSet = new Set<string>([
        ...files.keys(),
        ...filesToWrite.keys(),
      ])

      for (const fileToDelete of filesToDelete) {
        tempSet.delete(fileToDelete)
      }

      return Array.from(tempSet)
    },
    read: async (filePath) => {
      if (filesToWrite.has(filePath)) {
        return filesToWrite.get(filePath)!
      }

      if (filesToDelete.has(filePath)) {
        return null
      }

      if (fd === null) {
        return null
      }

      const { position, size } = files.get(filePath)!
      const dataBuffer = Buffer.alloc(size)

      await fs.read(fd, dataBuffer, 0, size, position)

      return dataBuffer
    },
    delete: (filePath) => {
      filesToDelete.add(filePath)
    },
    write: (filePath, data) => {
      filesToWrite.set(filePath, data)
    },
    save: async () => {
      if (filesToWrite.size === 0 && filesToDelete.size === 0) {
        if (fd !== null) {
          await fs.close(fd)
        }

        return
      }

      const tempTarFilePath = `${tarFilePath}.tmp`
      const tempFd = await fs.open(tempTarFilePath, 'w')
      let tempPos = 0

      if (fd !== null) {
        for (const filePath of files.keys()) {
          // updated file
          if (filesToWrite.has(filePath)) {
            const dataBuffer = filesToWrite.get(filePath)!
            const size = dataBuffer.byteLength
            const headerBuffer = generateHeader(filePath, size)

            await fs.write(tempFd, headerBuffer, 0, HEADER_SIZE, tempPos)
            await fs.write(tempFd, dataBuffer, 0, size, tempPos + HEADER_SIZE)

            tempPos += HEADER_SIZE + size + (HEADER_SIZE - size % HEADER_SIZE)
          // deleted file
          // old file
          } else if (!filesToDelete.has(filePath)) {
            const { position, size } = files.get(filePath)!
            const headerBuffer = Buffer.alloc(HEADER_SIZE)
            const dataBuffer = Buffer.alloc(size)

            await fs.read(fd, headerBuffer, 0, HEADER_SIZE, position - HEADER_SIZE)
            await fs.read(fd, dataBuffer, 0, size, position)

            await fs.write(tempFd, headerBuffer, 0, HEADER_SIZE, tempPos)
            await fs.write(tempFd, dataBuffer, 0, size, tempPos + HEADER_SIZE)

            tempPos += HEADER_SIZE + size + (HEADER_SIZE - size % HEADER_SIZE)
          }
        }
      }

      for (const filePath of filesToWrite.keys()) {
        // new file
        if (!files.has(filePath)) {
          const dataBuffer = filesToWrite.get(filePath)!
          const size = dataBuffer.byteLength
          const headerBuffer = generateHeader(filePath, size)

          await fs.write(tempFd, headerBuffer, 0, HEADER_SIZE, tempPos)
          await fs.write(tempFd, dataBuffer, 0, size, tempPos + HEADER_SIZE)

          tempPos += HEADER_SIZE + size + (HEADER_SIZE - size % HEADER_SIZE)
        }
      }

      files.clear()
      filesToWrite.clear()
      filesToDelete.clear()

      await fs.write(tempFd, Buffer.alloc(1024), 0, 1024, tempPos)

      if (fd !== null) {
        await fs.close(fd)
        fd = null
        await fs.unlink(tarFilePath)
      }

      await fs.close(tempFd)
      await fs.rename(tempTarFilePath, tarFilePath)
    },
    close: async () => {
      files.clear()
      filesToWrite.clear()
      filesToDelete.clear()

      if (fd !== null) {
        await fs.close(fd)
        fd = null
      }
    },
  }
}
