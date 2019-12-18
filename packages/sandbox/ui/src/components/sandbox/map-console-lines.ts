import { pipe } from '@psxcode/compose'
import { mapStateRef, onChange, startWithType } from 'refun'
import { TAnyObject, isUndefined, isFunction } from 'tsfn'
import { isHandler } from '../../utils'

export type TMapConsoleLines = {
  componentProps?: Readonly<TAnyObject>,
}

export const mapConsoleLines = <P extends TMapConsoleLines>() => pipe(
  startWithType<P & TMapConsoleLines>(),
  mapStateRef('consoleLinesRef', 'flushConsoleLines', () => [] as string[], []),
  onChange(({ componentProps, consoleLinesRef, flushConsoleLines }) => {
    if (isUndefined(componentProps)) {
      return
    }

    for (const key of Object.keys(componentProps!)) {
      if (isHandler(key) && isFunction(componentProps[key])) {
        const origHandler = componentProps[key]

        ;(componentProps as TAnyObject)[key] = (...args: any[]) => {
          origHandler(...args)
          consoleLinesRef.current = consoleLinesRef.current.concat(key)
          flushConsoleLines()
        }
      }
    }
  }, ['componentProps'])
)
