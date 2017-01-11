const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['donations_page'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/testcollective/donations`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective Test Group')
      .assert.visible('.Collective-transactions', 5000)
  },

  'Donations list': (client) => {

     client
       .assert.containsText('.CollectiveActivityItem:first-child', 'Donation 2')
       .assert.containsText('.CollectiveActivityItem:last-child', 'Donation 1')
       .end();
   }
};
