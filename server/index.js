if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}

require('babel-register');
require('./global');

const app = require('./app');

module.exports = app;
