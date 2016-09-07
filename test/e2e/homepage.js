const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['homepage'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'What is an open collective');
  },

  'Homepage shows': (client) => {

    client
      .assert.containsText('section[class=HomePageNumber]', '1\nCollectives')
      .end();
   }
};
