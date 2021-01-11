import test from 'tape'
import { getAppPage } from 'foreal'

type TFixtures = 'bare-bones' | 'disabled'
const getFixture = (filename: TFixtures) => `./fixtures/${filename}.tsx`

const PACKAGE = '@primitives/button'

test(`${PACKAGE} has proper role`, async (t) => {
  const entryPointPath = require.resolve(getFixture('bare-bones'))

  const page = await getAppPage({
    entryPointPath,
  })

  const el = await page.$('#btn')

  const a11ySnapBtn = await page.accessibility.snapshot({ interestingOnly: false, root: el })

  console.log(a11ySnapBtn)
  t.equal(a11ySnapBtn.role, 'button', 'button role is `button`')

  await page.close()
})

test(`${PACKAGE} can be focused`, async (t) => {
  const entryPointPath = require.resolve(getFixture('bare-bones'))

  const page = await getAppPage({
    entryPointPath,
  })

  const btnEl = await page.$('#btn')

  await page.focus('#btn')

  const a11ySnap = await page.accessibility.snapshot({ root: btnEl })

  t.ok(a11ySnap.focused)
  await page.close()
})

test(`${PACKAGE} can be disabled`, async (t) => {
  const entryPointPath = require.resolve(getFixture('disabled'))

  const page = await getAppPage({
    entryPointPath,
  })

  const btnEl = await page.$('#btn')
  const a11ySnapBtn = await page.accessibility.snapshot({ root: btnEl })

  t.ok(a11ySnapBtn.disabled)

  await page.close()
})
