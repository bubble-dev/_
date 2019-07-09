import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'

const pWriteFile = promisify(writeFile)

const prepareFiles = async (entryPointPath: string, targetFiles: string[]) => {
  let data = targetFiles.map((file, i) => `import file${i} from '${file}'`).join('\n')
  data += '\n'
  data += `export default [${targetFiles.map((file, i) => `{ path: '${file}', content: file${i} }`)}]`
  const outfilePath = path.join(path.dirname(entryPointPath), 'files.js')

  await pWriteFile(outfilePath, data)
}

export default prepareFiles
