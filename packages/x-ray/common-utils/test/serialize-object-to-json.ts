import test from 'blue-tape'
import { createElement } from 'react'
import { serializeObjectToJson } from '../src/serialize-object-to-json'

test.only('serializeObjectToJson', (t) => {
  t.equals(
    serializeObjectToJson({}),
    '{}',
    'should serialize empty object'
  )

  t.equals(
    serializeObjectToJson({
      foo: 'string',
      bar: 42,
      baz: null,
      bool: true,
      a: undefined,
      b: () => {},
      c: Symbol('desc'),
      s: Symbol(),
      d: new Date(0),
      e: /a/,
    }),
    '{"foo":"string","bar":42,"baz":null,"bool":true,"b":"[function(b)]","c":"[symbol(desc)]","s":"[symbol]","d":"1970-01-01T00:00:00.000Z","e":"[regexp(/a/)]"}',
    'should serialize empty object'
  )

  t.equals(
    serializeObjectToJson({
      foo: {
        bar: {
          baz: () => {},
        },
      },
    }),
    '{"foo":{"bar":{"baz":"[function(baz)]"}}}',
    'should serialize nested objects'
  )

  t.equals(
    serializeObjectToJson({
      foo: [
        {
          bar: [
            () => {},
          ],
        },
      ],
    }),
    '{"foo":[{"bar":["[function]"]}]}',
    'should serialize nested arrays'
  )

  t.equals(
    serializeObjectToJson({
      foo: createElement('div'),
    }),
    '{"foo":"[react(div)]"}',
    'should serialize react elements'
  )

  const Comp = () => null

  t.equals(
    serializeObjectToJson({
      foo: createElement(Comp),
    }),
    '{"foo":"[react(Comp)]"}',
    'should serialize react elements'
  )

  t.end()
})
