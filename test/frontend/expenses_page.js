const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['expenses_page'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/testcollective/expenses`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .assert.visible('div[class=PublicGroup-transactions]', 1000)
  },

  'Expenses list': (client) => {

     client
       .assert.containsText('div[class=PublicContent] > h2', 'All expenses')
       .assert.containsText('div[class=TransactionItem]:first-child', 'Expense 2')
       .assert.containsText('div[class=TransactionItem]:last-child', 'Expense 1')
       .end();
   }
};