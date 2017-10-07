const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['add_funds'],
  beforeEach: (client) => {
    const userLoginUrl = `${config.host.website}/api/test/loginlink`;

    resetDb(client)
      .url(userLoginUrl)
      .waitForElementVisible('body', 1000)
      .url(`${config.host.website}/testcollective/expenses`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective Test Group')
      .assert.visible('.Ledger-container', 5000)
      .assert.visible('#addFundsBtn', 10000)
  },

   'Add funds from host': (client) => {
     client
      .click('#addFundsBtn') // open add funds panel
      .setValue('.js-transaction-amount input', '240.47') // fill info
      .setValue('.js-transaction-title input', 'check from threadless')
      .setValue('.CustomTextArea textarea', 'monthly check for tshirts sold')
      .click('.AddFundsForm .Button') // submit
      .waitForElementVisible('.PublicGroupThanks', 5000)
      .assert.containsText('.PublicGroupThanks', 'Funds added')
      .click('#AddFundsForm-again') // click to submit another
      .assert.visible('.js-transaction-title', 5000) // verify panel reopens
      .end();
   },

   'Add funds from another user (still submitted by host)': (client) => {
     client
      .click('#addFundsBtn')
      .setValue('.js-transaction-amount input', '120.47')
      .setValue('.js-transaction-title input', 'check from threadless')
      .setValue('.CustomTextArea textarea', 'monthly check for tshirts sold')
      .click('.change-source')
      .waitForElementVisible('.js-transaction-name input', 5000)
      .setValue('.js-transaction-name input', 'josephine maldert')
      .setValue('.js-transaction-email input', 'josephine@maldert.com')
      .click('.AddFundsForm .Button')
      .waitForElementVisible('.PublicGroupThanks', 5000)
      .assert.containsText('.PublicGroupThanks', 'Funds added')
      .end();
   }
};
