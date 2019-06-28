import request from 'request-promise-native'
import plugin from '@start/plugin'

const TIMEOUT = 200

const checkPort = async (port: number, host: string) => {
  try {
    await request({
      timeout: TIMEOUT,
      uri: `http://${host}:${port}/json`,
      json: true,
    })

    return true
  } catch (e) {
    return false
  }
}

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

export default (port: number, host = 'localhost') =>
  plugin('wait-for-port', ({ logMessage }) => async () => {
    while (!(await checkPort(port, host))) {
      await sleep(200)
    }

    logMessage(String(port))
  })
