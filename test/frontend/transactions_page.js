module.exports = {
  '@tags': ['donation'],
  beforeEach: (client) => {
    client

      // reset test database
      .url('https://opencollective-test-api.herokuapp.com/database/reset')

      .url('http://localhost:3000/testcollective/transactions')
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .assert.visible('div[class=PublicGroup-transactions]', 1000)
  },

  'Empty transactions list': (client) => {

     client
       .assert.containsText('div[class=PublicGroup-transactions]', 'All transactions will show up here')
       .end();
  }
};