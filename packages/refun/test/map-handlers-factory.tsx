import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, startWithType, mapHandlersFactory } from '../src'

test('mapHandlersFactory', (t) => {
  const handlerSpy = createSpy(() => null)
  const propsSpy = createSpy(() => handlerSpy)
  const factorySpy = createSpy(() => ({
    onClick: propsSpy,
  }))
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string, bar: string }>(),
    mapHandlersFactory(factorySpy)
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo="foo"
        bar="bar"
      />
    )
  })

  const { onClick } = getProps(0)

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar', onClick }],
    ],
    'Mount: should pass props'
  )

  t.deepEquals(
    getSpyCalls(factorySpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
    ],
    'Mount: should call factory with props'
  )

  t.deepEquals(
    getSpyCalls(propsSpy),
    [],
    'Mount: should not call handler'
  )

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [],
    'Mount: should not call handler'
  )

  /* Update */
  act(() => {
    testRenderer.update(
      <MyComp
        foo="bar"
        bar="foo"
      />
    )
  })

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 'foo', bar: 'bar', onClick }],
      [{ foo: 'bar', bar: 'foo', onClick }],
    ],
    'Update: should pass props'
  )

  t.deepEquals(
    getSpyCalls(factorySpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
    ],
    'Update: should not call factory'
  )

  t.deepEquals(
    getSpyCalls(propsSpy),
    [],
    'Update: should not call handler'
  )

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [],
    'Update: should not call handler'
  )

  /* Invoke Handler */
  act(() => {
    onClick(1, 2)
  })

  t.deepEquals(
    getSpyCalls(factorySpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
    ],
    'Invoke Handler: should not call factory'
  )

  t.deepEquals(
    getSpyCalls(propsSpy),
    [
      [{ foo: 'bar', bar: 'foo' }],
    ],
    'Invoke Handler: should call handler'
  )

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [
      [1, 2],
    ],
    'Invoke Handler: should call handler'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(factorySpy),
    [
      [{ foo: 'foo', bar: 'bar' }],
    ],
    'Unmount: should not call factory'
  )

  t.deepEquals(
    getSpyCalls(propsSpy),
    [
      [{ foo: 'bar', bar: 'foo' }],
    ],
    'Unmount: should not call handler'
  )

  t.deepEquals(
    getSpyCalls(handlerSpy),
    [
      [1, 2],
    ],
    'Unmount: should not call handler'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})
