const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['donations_page'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/testcollective/donations`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .assert.visible('div[class=PublicGroup-transactions]', 5000)
  },

  'Donations list': (client) => {

     client
       .assert.containsText('div[class=PublicContent] > h2', 'All donations')
       .assert.containsText('div[class=TransactionItem]:first-child', 'Donation 2')
       .assert.containsText('div[class=TransactionItem]:last-child', 'Donation 1')
       .end();
   }
};
