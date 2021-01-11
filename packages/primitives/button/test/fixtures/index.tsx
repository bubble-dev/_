import * as React from 'react'
import { Button } from '../..'

/* <input id="foo" value="Foo bar"/> */

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
