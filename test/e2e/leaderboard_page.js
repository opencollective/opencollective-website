const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['leaderboard_page'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/leaderboard`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Open Collective Leaderboard')
  },

  'Leaderboard shows': (client) => {

    client
      .assert.containsText('div[class=Leaderboard-data]', 'Collective Donations Amount raised Last Donation Date')
      .assert.containsText('td[class=Leaderboard-group-name]', 'OpenCollective Test Group')
      .assert.containsText('td[class=Leaderboard-donations]', '2')
      .assert.containsText('td[class=Leaderboard-amount]', 'EUR €3')
      .end();
   }
};
