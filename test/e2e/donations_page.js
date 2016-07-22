const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['donations_page'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/testcollective/donations`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective Test Group')
      .assert.visible('.expenses-container', 5000)
  },

  'Donations list': (client) => {

     client
       // .assert.containsText('.line1.-latest', 'Latest donations')
       .assert.containsText('.ExpenseItem:first-child', 'Donation 2')
       .assert.containsText('.ExpenseItem:last-child', 'Donation 1')
       .end();
   }
};
