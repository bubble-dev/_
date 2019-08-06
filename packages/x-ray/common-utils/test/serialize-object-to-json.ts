import test from 'blue-tape'
import { createElement } from 'react'
import { SerializeObjectToJson } from '../src/serialize-object-to-json'

test('serializeObjectToJson', (t) => {
  t.equals(
    SerializeObjectToJson()({}),
    '{}',
    'should serialize empty object'
  )

  t.equals(
    SerializeObjectToJson()({
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
    '{"foo":"string","bar":42,"baz":null,"bool":true,"b":"[function(b) (0)]","c":"[symbol(desc) (0)]","s":"[symbol (1)]","d":"1970-01-01T00:00:00.000Z","e":"[regexp(/a/) (0)]"}',
    'should serialize empty object'
  )

  t.equals(
    SerializeObjectToJson()({
      foo: {
        bar: {
          baz: () => {},
        },
      },
    }),
    '{"foo":{"bar":{"baz":"[function(baz) (0)]"}}}',
    'should serialize nested objects'
  )

  t.equals(
    SerializeObjectToJson()({
      foo: [
        {
          bar: [
            () => {},
          ],
        },
      ],
    }),
    '{"foo":[{"bar":["[function (0)]"]}]}',
    'should serialize nested arrays'
  )

  t.equals(
    SerializeObjectToJson()({
      foo: createElement('div'),
    }),
    '{"foo":"[react(div) (0)]"}',
    'should serialize react elements'
  )

  const Comp = () => null

  t.equals(
    SerializeObjectToJson()({
      foo: createElement(Comp),
    }),
    '{"foo":"[react(Comp) (0)]"}',
    'should serialize react elements'
  )

  t.end()
})
