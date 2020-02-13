import { TBumpType } from '@auto/utils'

export type TParsedMessageType = TBumpType | 'publish'

export type TParsedMessage = {
  type: TParsedMessageType,
  names: string[],
  message: string,
  description?: string,
}
