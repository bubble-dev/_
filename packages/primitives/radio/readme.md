`Radio` brings the equivalent of an `<input type="radio" />` to Native land.

## Handling changes

Context passes down a `groupValue` and a `groupName` together with a `setGroupValue` action to all its consumers. Both the value and the state are set by a `useState` hook within the consumer’s side, while `groupName` is a hardcoded `string` that marks the group name.
