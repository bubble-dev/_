import querystring from 'querystring'
import got from 'got'
import getConfig from './getConfig'

const ENDPOINT = 'https://codecov.io/upload/v2'
const TIMEOUT = 5000
const RETRIES = 3

export default async (data: string) => {
  const config = getConfig()
  const queryString = querystring.stringify(config)
  const postURL = `${ENDPOINT}?${queryString}`
  const { body: reportURL } = await got.post(postURL, {
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'text/plain',
    },
    timeout: TIMEOUT,
    retry: RETRIES,
    body: data,
  })

  console.log('---', reportURL, '---')

  return {
    reportURL,
    config,
  }
}
