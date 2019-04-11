export type TAnyObject = {
  [key: string]: any
}
export type TKeyOf<T> = Exclude<keyof T, number | symbol>
export type TIntersect <T1 extends {}, T2 extends {}> = { [K in Extract<keyof T1, keyof T2>]: T1[K] }
export type TRequireKeys<T, K extends keyof T> = T & {
  [P in Extract<keyof T, K>]: Exclude<T[P], undefined>;
}

export const getObjectKeys = <T extends {}> (obj: T) => Object.keys(obj) as (keyof T)[]

export const EMPTY_OBJECT = Object.freeze(Object.create(null)) as any
export const EMPTY_ARRAY = [] as any
export const UNDEFINED = void 0

export const isUndefined = (value: any): value is undefined => value === UNDEFINED
export const isNumber = (value: any): value is number => typeof value === 'number' && isFinite(value)
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isObject = (value: any): value is TAnyObject => Object.prototype.toString.call(value) === '[object Object]'

export const requestAnimationFrame = (global as any as Window).requestAnimationFrame || global.setImmediate
export const cancelAnimationFrame = (global as any as Window).cancelAnimationFrame || global.clearImmediate

export * from './omit'
export * from './extend'
