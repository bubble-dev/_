import React, { Context, useContext, useRef, FC } from 'react'
import { EMPTY_OBJECT, TExtend } from 'tsfn'

export const mapContextOverride = <K extends string, CP, P extends {}>(providerName: K, context: Context<CP>, getValue: (props: P, contextProps: CP) => Partial<CP>) =>
  (props: P): TExtend<P, { [k in K]: FC }> => {
    const contextValue = useContext(context)
    const contextProvider = useRef<FC>(EMPTY_OBJECT)
    const contextValueRef = useRef(EMPTY_OBJECT)

    contextValueRef.current = {
      ...contextValue,
      ...getValue(props, contextValue),
    }

    if (contextProvider.current === EMPTY_OBJECT) {
      contextProvider.current = ({ children }) => (
        <context.Provider value={contextValueRef.current}>
          {children}
        </context.Provider>
      )
    }

    return {
      ...props,
      [providerName]: contextProvider.current,
    } as any
  }
