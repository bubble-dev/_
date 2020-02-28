import { Transform } from 'stream'
import replaceString from 'replace-string'

const replace = (str: string, searchValue: RegExp | string, replaceValue: string) => {
  if (typeof searchValue === 'string') {
    return replaceString(str, searchValue, replaceValue)
  }

  return str.replace(searchValue, replaceValue)
}

export const replaceStream = (searchValue: RegExp | string, replaceValue: string): Transform => {
  let tempString = ''

  return new Transform({
    transform(chunk: Buffer, encoding, callback) {
      const chunkString = chunk.toString('utf8')
      const newlineIndex = chunkString.indexOf('\n')

      if (newlineIndex >= 0) {
        tempString += chunkString.substr(0, newlineIndex)

        this.push(`${replace(tempString, searchValue, replaceValue)}\n`)

        tempString = ''

        if (newlineIndex + 1 < chunkString.length) {
          return this._transform(chunkString.substr(newlineIndex + 1), encoding, callback)
        }
      } else {
        tempString += chunkString
      }

      callback()
    },

    flush(callback) {
      if (tempString.length > 0) {
        this.push(replace(tempString, searchValue, replaceValue))
      }

      callback()
    },
  })
}
