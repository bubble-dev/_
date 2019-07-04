export default (src) => {
  let result = 'const { AppRegistry } = require(\'react-native\')\n\n'
  result += src
  result += '\n\n'
  result += 'AppRegistry.registerComponent(\'rebox\', () => App)'

  return result
}
