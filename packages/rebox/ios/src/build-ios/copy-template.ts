import path from 'path'
import { promisify } from 'util'
import { access } from 'graceful-fs'
import makeDir from 'make-dir'
import globby from 'globby'
import copie from 'copie'

const pAccess = promisify(access)
const globbyOptions = {
  ignore: ['node_modules/**'],
  deep: true,
  onlyFiles: true,
  absolute: true,
}

export const copyTemplate = async (outputPath: string) => {
  try {
    await pAccess(outputPath)
  } catch (e) {
    const templatePath = path.join(path.dirname(require.resolve('../../package.json')), 'ios')
    const files = await globby(`${templatePath}/**/*`, globbyOptions)

    for (const file of files) {
      const outFile = file.replace('packages/rebox/ios', 'node_modules/.rebox/X-Ray')
      const outDir = path.dirname(outFile)

      await makeDir(outDir)
      await copie(file, outFile)
    }
  }
}
