const config = require('config');

module.exports = client => {
  return client
    .url(`${config.host.api}/database/reset`)
    .assert.title("", `checking ${config.host.api}/database/reset didn't return error`);
};
