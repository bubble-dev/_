import test from 'tape'
import { getAppPage } from 'foreal'

const PACKAGE = '@primitives/heading'
type TFixtures = 'h1'
const getFixture = (filename: TFixtures) => `./fixtures/${filename}.tsx`

test(`${PACKAGE} outputs children properly`, async (t) => {
  const entryPointPath = require.resolve(getFixture('h1'))

  const page = await getAppPage({
    entryPointPath,
  })

  const h1Content = await page.$eval('#foo', (el: any) => el.textContent)

  t.equal(h1Content, 'Foo bar', 'strings match')

  await page.close()
})

test(`${PACKAGE} as h1 has proper level`, async (t) => {
  const entryPointPath = require.resolve(getFixture('h1'))

  const page = await getAppPage({
    entryPointPath,
  })
  const h1El = await page.$('#foo')

  const a11ySnap = await page.accessibility.snapshot({ root: h1El })

  t.equal(a11ySnap.level, 1, 'H1 has role-level 1')

  await page.close()
})

test('Heading needs to have role="heading"', async (t) => {
  const entryPointPath = require.resolve(getFixture('h1'))

  const page = await getAppPage({
    entryPointPath,
  })
  const h1El = await page.$('#foo')

  const a11ySnap = await page.accessibility.snapshot({ root: h1El })

  t.equal(a11ySnap.role, 'heading', 'H1 has role "heading"')

  await page.close()
})
