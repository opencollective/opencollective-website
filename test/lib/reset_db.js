const config = require('config');

module.exports = client => {
  return client
    .url(`${config.host.api}/database/reset`)
    .assert.title("", "checking reset API didn't return error");
};