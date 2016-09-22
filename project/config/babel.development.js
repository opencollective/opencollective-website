import findCache from 'find-cache-dir'
import compact from 'lodash/compact'

export default (options) => ({
  // Ignore the project's babelrc
  babelrc: false,

  // Creates a cache in node_modules/.cache
  cacheDirectory: findCache({
    name: 'opencollective-website'
  }),

  presets: demodularize(resolvePaths([
    "babel-preset-es2015",
    "babel-preset-stage-0",
    "babel-preset-react",
    (options.hot ? "babel-preset-react-hmre" : null)
  ])),

  plugins: resolvePaths([
    "babel-plugin-add-module-exports",
    "babel-plugin-lodash",
    "babel-plugin-transform-export-extensions",
    "babel-plugin-transform-async-to-generator",
    "babel-plugin-transform-regenerator"
  ])
})

const resolvePaths = (shortNames) =>
  compact(shortNames).map(require.resolve)

// disables the commonjs modules transform from babel. only useful in webpack
const demodularize = (list) => {
  list[0] = [list[0], {
    modules: false
  }]

  return list
}
