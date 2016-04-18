const config = require('config');

module.exports = client => {
  return client
    .url(`${config.host.api}/database/reset`)
    .assert.containsText('body', '\"success\":true');
};
