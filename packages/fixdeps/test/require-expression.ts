import test from 'blue-tape'
import { getDependenciesInContent } from '../src/utils/get-dependencies-in-content'

test('require-expression: package dependency', (t) => {
  const content = `
  const path = require('path')
  const fs = require('fs')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['path', 'fs'],
    'should find required packages'
  )

  t.end()
})

test('require-expression: package with path', (t) => {
  const content = `
  const { func } = require('pkg/path/to/file')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should find package name'
  )

  t.end()
})

test('require-expression: scoped package', (t) => {
  const content = `
  const { func1 } = require('@scope/pkg')
  const { func2 } = require('@ns/my-package/path/to/file')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    [
      '@scope/pkg',
      '@ns/my-package',
    ],
    'should find scoped packages'
  )

  t.end()
})

test('require-expression: relative paths', (t) => {
  const content = `
  const { func1 } = require('../src/path/to/file')
  const { func2 } = require('./file')
  const { func3 } = require('pkg')
  `
  const deps = getDependenciesInContent(content)

  t.deepEquals(
    deps,
    ['pkg'],
    'should skip relative paths'
  )

  t.end()
})
