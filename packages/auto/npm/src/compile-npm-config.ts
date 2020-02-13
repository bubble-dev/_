import { TNpmConfig } from '@auto/utils'

const defaultConfig: Required<TNpmConfig> = {
  registry: 'https://registry.npmjs.org/',
  publishSubDirectory: '',
  access: 'restricted',
}

const accessTypes: TNpmConfig['access'][] = ['public', 'restricted']

export const compileNpmConfig = (rootConfig?: TNpmConfig, packageConfig?: TNpmConfig): Required<TNpmConfig> => {
  const result = {
    ...defaultConfig,
    ...rootConfig,
    ...packageConfig,
  }

  if (!accessTypes.includes(result.access)) {
    throw new Error('Incorrect access type')
  }

  if (!/^https?:\/\//.test(result.registry)) {
    throw new Error('Incorrect registry url')
  }

  return result
}
