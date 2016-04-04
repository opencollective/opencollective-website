const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['expenses_page'],
  beforeEach: (client) => {

    resetDb(client)
      .url(`${config.host.website}/testcollective/expenses`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .assert.visible('div[class=PublicGroup-transactions]', 3000)
  },

  'Expenses list': (client) => {

     client
       .assert.containsText('div[class=PublicContent] > h2', 'All expenses')
       .assert.containsText('div[class=TransactionItem]:first-child', 'Expense 2')
       .assert.containsText('div[class=TransactionItem]:last-child', 'Expense 1')
       .end();
   },

   'Submit expense': (client) => {
     client
      .click('#submitExpenseBtn')
      .setValue('.js-transaction-description input', 'drinks')
      .setValue('.js-transaction-amount input', 10)
      .setValue('.js-transaction-paymentMethod', 'other')
      .setValue('.js-transaction-email input', 'test@gmail.com')
      .setValue('.js-transaction-note', 'test note')
      .click('button[type=submit]')
      .waitForElementVisible('.PublicGroupThanks', 1000)
      .assert.containsText('.PublicGroupThanks', 'Expense sent')
      .end();
   }
};
