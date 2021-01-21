import { getAppPage } from 'foreal'
import { getA11yData } from 'r11y'

export async function renderApp(fixturePath: string) {
  try {
    return await getAppPage({
      entryPointPath: fixturePath,
    })
  } catch (error) {
    throw new Error(error)
  }
}

export async function getA11yReport(fixturePath: string) {
  try {
    return await getA11yData({
      entryPointPath: fixturePath,
    })
  } catch (error) {
    throw new Error(error)
  }
}
