import test from 'blue-tape'
import { TNpmConfig } from '@auto/utils'
import { compileNpmConfig } from '../src/compile-npm-config'

test('compileNpmConfig', (t) => {
  t.deepEquals(
    compileNpmConfig(),
    {
      registry: 'https://registry.npmjs.org/',
      publishSubDirectory: '',
      access: 'restricted',
    },
    'defaults'
  )

  t.deepEquals(
    compileNpmConfig({
      registry: 'http://custom',
      publishSubDirectory: 'build',
      access: 'public',
    }),
    {
      registry: 'http://custom',
      publishSubDirectory: 'build',
      access: 'public',
    },
    'root options'
  )

  t.deepEquals(
    compileNpmConfig({
      registry: 'http://custom',
      publishSubDirectory: 'build',
      access: 'public',
    }, {
      registry: 'https://local',
      publishSubDirectory: 'dist',
      access: 'restricted',
    }),
    {
      registry: 'https://local',
      publishSubDirectory: 'dist',
      access: 'restricted',
    },
    'local override'
  )

  t.throws(() => {
    compileNpmConfig({
      registry: 'invalid',
    })
  }, /Incorrect registry/)

  t.throws(() => {
    compileNpmConfig({
      access: 'blabla' as TNpmConfig['access'],
    })
  }, /Incorrect access/)

  t.end()
})
