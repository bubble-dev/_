import { TBumpType } from '@auto/utils'

export type TSlackOptions = {
  token: string,
  channel: string,
  username: string,
  iconEmoji: string,
  colors: {
    initial: string,
    major: string,
    minor: string,
    patch: string,
  },
}

export type TTelegramOptions = {
  token: string,
  chatId: string,
}

export type TGithubOptions = {
  token: string,
  username: string,
  repo: string,
}

export type TLogMessage = {
  type: TBumpType | 'dependencies',
  value: string,
  description?: string,
}

export type TLog = {
  name: string,
  version: string,
  type: TBumpType,
  dir: string,
  messages: TLogMessage[],
}
