import test from 'tape'
import { getAppPage } from 'foreal'

test('test the test', async (t) => {
  const entryPointPath = require.resolve('./fixtures/index.tsx')

  const page = await getAppPage({
    entryPointPath,
  })

  const result = await page.$eval('#foo', (el: any) => el.textContent)
  const accessibility = await page.accessibility.snapshot()

  console.log(accessibility)
  // log:
  // {
  //   role: 'WebArea',
  //   name: '',
  //   children: [ { role: 'heading', name: 'Foo bar', level: 1 } ]
  // }

  t.equal(result, 'Foo bar', 'strings match')

  await page.close()
})
