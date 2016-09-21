const promisify = require('bluebird').promisify
const fsx = require('fs-extra')
const mapValues = require('lodash/mapValues')

module.exports = mapValues(fsx, (fn, name) => (
  name.match(/Sync$/) || typeof fn !== 'function'
    ? fn
    : promisify(fn)
))
