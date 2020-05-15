import React from 'react'
import { Block } from '@primitives/block'
import { RadioContext } from './context'

// This Component will be passed by the consumer,
// but without it, it's quite pointless to have
// RadioInput on Sandbox.
type TPresentationProps = {
  value: string,
  isDisabled?: boolean,
}

const PresentationElement = ({ isDisabled, value }: TPresentationProps) => (
  <RadioContext.Consumer>
    {({ groupValue }) => (
      <Block style={{
        color: isDisabled ? 'grey' : 'hotpink',
        fontWeight: groupValue === value ? 800 : 400,
      }}
      >
        {value}
      </Block>
    )}
  </RadioContext.Consumer>
)

export { PresentationElement }
