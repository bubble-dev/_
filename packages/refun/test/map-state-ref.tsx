import React from 'react'
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer'
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { component, mapStateRef, startWithType } from '../src'

test('mapStateRef', (t) => {
  const mapStateSpy = createSpy(({ args }) => [args[0].foo * 2])
  const compSpy = createSpy(() => null)
  const getProps = (renderIndex: number) => getSpyCalls(compSpy)[renderIndex][0]
  const getNumRenders = () => getSpyCalls(compSpy).length
  const MyComp = component(
    startWithType<{
      foo: number,
      bar?: string,
    }>(),
    mapStateRef('state', 'setState', mapStateSpy, ['foo'])
  )(compSpy)

  /* Mount */
  let testRenderer!: ReactTestRenderer

  act(() => {
    testRenderer = TestRenderer.create(
      <MyComp
        foo={1}
      />
    )
  })

  const { state, setState } = getProps(0)

  t.deepEquals(
    state.current,
    [2],
    'Mount: shoud pass state ref'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state, setState }],
    ],
    'Mount: should pass props, state and state-setter'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ foo: 1 }],
    ],
    'Mount: should call map function'
  )

  /* Update unwatched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={1}
        bar="bar"
      />
    )
  })

  t.equals(
    getProps(1).state.current,
    state.current,
    'Update unwatched props: shoud pass same state instance'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state, setState }],
      [{ foo: 1, bar: 'bar', state, setState }],
    ],
    'Update unwatched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ foo: 1 }],
    ],
    'Mount: should not call map function'
  )

  /* Update watched props */
  act(() => {
    testRenderer.update(
      <MyComp
        foo={4}
        bar="bar"
      />
    )
  })

  t.deepEquals(
    state.current,
    [8],
    'Update watched props: shoud update state'
  )

  t.deepEquals(
    getSpyCalls(compSpy),
    [
      [{ foo: 1, state, setState }],
      [{ foo: 1, bar: 'bar', state, setState }],
      [{ foo: 4, bar: 'bar', state, setState }],
    ],
    'Update watched props: should pass props'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ foo: 1 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update watched props: should call map function'
  )

  /* Flush state */
  act(() => {
    setState()
  })

  t.deepEquals(
    state.current,
    [8],
    'Flush state: shoud update state'
  )

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ foo: 1 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Update state: should not call map function'
  )

  /* Unmount */
  act(() => {
    testRenderer.unmount()
  })

  t.deepEquals(
    getSpyCalls(mapStateSpy),
    [
      [{ foo: 1 }],
      [{ foo: 4, bar: 'bar' }],
    ],
    'Unmount: should not call map function'
  )

  t.equals(
    getNumRenders(),
    4,
    'Renders: should render component exact times'
  )

  t.equals(
    getNumRenders(),
    4,
    'Render: should render component exact times'
  )

  t.end()
})
