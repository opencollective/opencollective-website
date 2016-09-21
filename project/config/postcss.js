const cssNext = require('postcss-cssnext');
const cssImport = require('postcss-import');
const cssNested = require('postcss-nested');
const cssnano = require('cssnano');

export const postCSS = (webpack) => {
  const base = ([
    cssNext({
      browsers: ['last 2 versions', 'IE > 10']
    }),
    cssImport({
      addDependencyTo: webpack
    }),
    cssNested()
  ])

  if (process.env.NODE_ENV === 'production') {
    base.push(cssnano())
  }

  return base
}

export default postCSS
