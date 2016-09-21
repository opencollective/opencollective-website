/**
 * These ENV vars will automatically be injected into the webpack build
 */

export const EXPOSE_VARS = [
  'API_ROOT',
  'WEBSITE_URL'
]

export const EXPOSE_ENV = EXPOSE_VARS.reduce((memo, key) => {
    memo[`process.env.${key}`] = JSON.stringify(process.env[key])
    return memo
  }, {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
