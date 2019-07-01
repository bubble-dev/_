export const raw = {
  // Useful for determining whether we’re running in production mode.
  // Most importantly, it switches React into the correct mode.
  NODE_ENV: process.env.NODE_ENV || 'development',
  PUBLIC_URL: '',
}

// Stringify all values so we can feed into Webpack DefinePlugin
export const stringifiedEnv = {
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key])

    return env
  }, {}),
}
