const config = require('config');

module.exports = {
  beforeEach: (client) => {

    client

      // reset test database
      .url(`${config.host.api}/database/reset`)

      .url(`${config.host.website}/testcollective/donations`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .assert.visible('div[class=PublicGroup-transactions]', 1000)
  },

  'Donations list': (client) => {

     client
       .assert.containsText('div[class=PublicContent] > h2', 'All donations')
       .waitForElementVisible('div[class=TransactionItem]', 1000)
       .assert.containsText('div[class=TransactionItem]:first-child', 'Donation 2')
       .assert.containsText('div[class=TransactionItem]:last-child', 'Donation 1')
       .end();
   }
};