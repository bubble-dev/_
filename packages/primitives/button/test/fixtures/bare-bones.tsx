import * as React from 'react'
import { Button } from '../../src'

const App = () => (
  <Button
    aria-label={'accessibilityLabel'}
    isDisabled={false}
    id={'btn'}
    onPress={() => {}}
  >
    Foo bar
  </Button>
)

export default App
