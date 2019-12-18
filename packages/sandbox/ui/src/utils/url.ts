import { TAnyObject } from 'tsfn'
import queryString from 'query-string'

export const encodeUrl = (obj: TAnyObject): string => queryString.stringify(obj)

export const decodeUrl = (hash: string): TAnyObject =>
  queryString.parse(hash, {
    parseBooleans: true,
    parseNumbers: true,
  })
