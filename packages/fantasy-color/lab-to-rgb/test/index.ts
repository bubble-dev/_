import test from 'blue-tape'
import labToRgb from '../src'

test('labToRgb: white', async (t) => {
  const color = labToRgb({
    luminance: 100,
    a: 0,
    b: 0,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('labToRgb: gray', async (t) => {
  const color = labToRgb({
    luminance: 53.19277745493915,
    a: 0,
    b: 0,
  })

  await t.deepEquals(
    color,
    {
      red: 127,
      green: 127,
      blue: 127,
    },
    'must turn to RGB'
  )
})

test('labToRgb: black', async (t) => {
  const color = labToRgb({
    luminance: 0,
    a: 0,
    b: 0,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('labToRgb: red', async (t) => {
  const color = labToRgb({
    luminance: 54.29173376861782,
    a: 80.8124553179771,
    b: 69.88504032350531,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('labToRgb: dark red', async (t) => {
  const color = labToRgb({
    luminance: 24.29173376861782,
    a: 80.8124553179771,
    b: 69.88504032350531,
  })

  await t.deepEquals(
    color,
    {
      red: 157,
      green: -147,
      blue: -70,
    },
    'must turn to RGB'
  )
})

test('labToRgb: green', async (t) => {
  const color = labToRgb({
    luminance: 87.81812823940444,
    a: -79.28728092989567,
    b: 80.99025618375525,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('labToRgb: blue', async (t) => {
  const color = labToRgb({
    luminance: 29.567572863553245,
    a: 68.29865326565671,
    b: -112.02942991288025,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('labToRgb: purple', async (t) => {
  const color = labToRgb({
    luminance: 60.16969588191749,
    a: 93.55002493980824,
    b: -60.498555897447304,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('labToRgb: some color', async (t) => {
  const color = labToRgb({
    luminance: 15.966897718378611,
    a: 13.086860007892998,
    b: 12.202929512042749,
  })

  await t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
    },
    'must turn to RGB'
  )
})
