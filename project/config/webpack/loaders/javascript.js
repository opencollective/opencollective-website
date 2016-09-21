import development from '../../babel.development'
import production from '../../babel.production'

export const babelHotLoader = (options) => ({
  test: /\.js$/,
  loader: 'babel',
  query: {
    babelrc: false,
    ...development({
      hot: process.argv.indexOf('--hot') >= 0 || process.env.ENABLE_HMR
    })
  },
  include: options.include,
  exclude: options.exclude
})

export const babelLoader = (options = {}) => ({
  test: /\.js$/,
  query: {
    ...production(),
    babelrc: false
  },
  include: options.include,
  exclude: options.exclude
})
