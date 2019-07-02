import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'

const pWriteFile = promisify(writeFile)

const prepareFiles = async (targetFiles: string[]) => {
  let outfile = targetFiles.map((file, i) => `import file${i} from '${file}'`).join('\n')
  outfile += '\n'
  outfile += `export default [${targetFiles.map((file, i) => `{ path: '${file}', content: file${i} }`)}]`

  await pWriteFile(path.join(__dirname, '../build/native', 'files.js'), outfile, { encoding: 'utf8' })
}

export default prepareFiles
