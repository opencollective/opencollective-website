require('babel-register')
const join = require('path').join

process.env.SERVER_VIEWS_PATH = join(__dirname, 'src', 'views')
process.env.NODE_CONFIG_DIR = join(__dirname, 'config')

module.exports = require('./webpack.config.babel.js')('development', {
  target: 'node'
})
