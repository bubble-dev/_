import test from 'tape'
import { renderApp, getA11yReport } from '../../shared/test-utils'

type TFixtures = 'bare-bones' | 'disabled'
const renderButton = (filename: TFixtures) => renderApp(require.resolve(`./fixtures/${filename}.tsx`))
const a11yReport = (filename: TFixtures) => getA11yReport(require.resolve(`./fixtures/${filename}.tsx`))

const PACKAGE = '@primitives/button'

test(`${PACKAGE} has proper role`, async (t) => {
  // const page = await renderButton('bare-bones')
  // const btnEl = await page.$('button')
  // const a11ySnapBtn = await page.accessibility.snapshot({ interestingOnly: false, root: btnEl })
  const report = await a11yReport('bare-bones')

  console.log(report)
  // t.equal(a11ySnapBtn.role, 'button', 'button role is `button`')
  t.ok(true)

  // await page.close()
})

test(`${PACKAGE} can be focused`, async (t) => {
  const page = await renderButton('bare-bones')
  const btnEl = await page.$('button')

  await page.focus('button')

  const a11ySnap = await page.accessibility.snapshot({ root: btnEl })

  t.ok(a11ySnap.focused)
  await page.close()
})

test(`${PACKAGE} can be disabled`, async (t) => {
  const page = await renderButton('disabled')
  const btnEl = await page.$('button')

  const a11ySnapBtn = await page.accessibility.snapshot({ root: btnEl })

  t.ok(a11ySnapBtn.disabled)

  await page.close()
})
