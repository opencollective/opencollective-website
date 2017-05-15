const config = require('config');

module.exports = client => {
  const resetUrl = `${config.host.website}/api/database/reset`;
  return client
    .url(resetUrl)
    .assert.containsText('body', '\"success\":true', `checking ${resetUrl} call succeeded`);
};