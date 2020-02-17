import fetch from 'node-fetch'
import { TPrefixes, removeAutoNamePrefix } from '@auto/utils'
import { TELEGRAM_API_URL, TELEGRAM_MESSAGE_MAX_LENGTH } from './utils'
import { TTelegramOptions, TLog } from './types'

export const sendTelegramMessage = async (logs: TLog[], prefixes: TPrefixes, telegramOptions: TTelegramOptions) => {
  if (typeof telegramOptions.token !== 'string') {
    throw new Error('Telegram token is required')
  }

  let data = logs
    .reduce((result, log) => {
      const name = removeAutoNamePrefix(log.name)
      let text = ''

      if (result.length > 0) {
        text += '\n\n'
      }

      text += `*${name} v${log.version}*\n`

      log.messages.forEach((message) => {
        text += `\n${prefixes.required[message.type].value} ${message.value}`
      })

      return result + text
    }, '')

  if (data.length > TELEGRAM_MESSAGE_MAX_LENGTH) {
    data = `${data.slice(0, TELEGRAM_MESSAGE_MAX_LENGTH - 1)}…`
  }

  const response = await fetch(
    `${TELEGRAM_API_URL}bot${telegramOptions.token}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramOptions.chatId,
        parse_mode: 'markdown',
        text: data,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
