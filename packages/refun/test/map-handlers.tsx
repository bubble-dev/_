import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapHandlers, startWithType } from '../src'

test('mapHandlers', (t) => {
  const eventSpy = createSpy(() => null)
  const propsSpy = createSpy(() => eventSpy)
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{ foo: string, bar: string }>(),
    mapHandlers({
      onClick: propsSpy,
    })
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
    getSpyCalls(propsSpy),
    [],
    'Mount: should not call external handler'
  )

  t.deepEquals(
    getSpyCalls(eventSpy),
    [],
    'Mount: should not call internal handler'
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
    'Update: should pass same handler instance'
  )

  t.deepEquals(
    getSpyCalls(propsSpy),
    [],
    'Update: should not call external handler'
  )

  t.deepEquals(
    getSpyCalls(eventSpy),
    [],
    'Update: should not call internal handler'
  )

  /* Invoke Handler */
  act(() => {
    onClick(1, 2)
  })

  t.deepEquals(
    getSpyCalls(propsSpy),
    [
      [{ foo: 'bar', bar: 'foo' }],
    ],
    'Invoke Handler: should call external handler'
  )

  t.deepEquals(
    getSpyCalls(eventSpy),
    [
      [1, 2],
    ],
    'Invoke Handler: should call internal handler'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(propsSpy),
    [
      [{ foo: 'bar', bar: 'foo' }],
    ],
    'Unmount: should not call external handler'
  )

  t.deepEquals(
    getSpyCalls(eventSpy),
    [
      [1, 2],
    ],
    'Unmount: should not call internal handler'
  )

  t.equals(
    getNumRenders(),
    2,
    'Render: should render component exact times'
  )

  t.end()
})
