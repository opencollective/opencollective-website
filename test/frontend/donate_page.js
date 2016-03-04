const config = require('config');

module.exports = {
  '@tags': ['donate_page'],
   beforeEach: (client) => {

    client
      // reset test database
      .url(`${config.host.api}/database/reset`)
  },

  'Donate button shows USD $100.00': (client) => {
    client
      .url(`${config.host.website}/testcollective/donate/100`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('div[class=PublicGroupForm-disclaimer]', 'USD $100.00')
      .end();
   },
   
  'Donate button shows USD $100.00 per month': (client) => {
    client
      .url(`${config.host.website}/testcollective/donate/100/monthly`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('div[class=PublicGroupForm-disclaimer]', 'USD $100.00 per month')
      .end();
   },
   
};