const cssNext = require('postcss-cssnext');
const cssImport = require('postcss-import');
const cssNested = require('postcss-nested');

export const postCSS = () => ([
  cssNext,
  cssImport,
  cssNested
])

export default postCSS
