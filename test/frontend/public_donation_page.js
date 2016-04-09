const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['public_donation_page'],
  beforeEach: (client) => {
   resetDb(client)
      .url(`${config.host.website}/testcollective`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .waitForElementVisible('div[class=Tiers]', 1000)
      .assert.containsText('div[class=Tiers]', 'Backers')

      // click on top green "Back us" button
      .click('a[href="#support"]')
      .assert.urlContains('#support')

      // wait for bottom green button to show up
      .waitForElementVisible('div[class="Button Button--green"]', 1000)
      .assert.containsText('div[class="Button Button--green"]', 'BECOME A BACKER')
  },

  'Redirects to paypal after clicking donate': (client) => {

    client
      // Click Donate
      .click('div[class="Button Button--green"]')
      .pause(10000)
      .assert.urlContains('https://www.sandbox.paypal.com/') // redirected to paypal
      .end();
  },

  'Shows thank you page after a paypal donation if user is full account': (client) => {

    client
      // callback after filling paypal
      .url(`${config.host.website}/testcollective?status=payment_success&userid=1&has_full_account=true`)
      .waitForElementVisible('div[class=PublicGroupThanks]', 10000)
      .assert.containsText('body', 'Thank you for your support')
      .end();
  },

  'Shows the user form after a paypal donation if user does not have a full account': (client) => {

    client
      // callback after filling paypal
      .url(`${config.host.website}/testcollective?status=payment_success&userid=1&has_full_account=false`)
      .waitForElementVisible('div[class=PublicGroupSignup]', 10000)
      .assert.containsText('body', 'How should we show you on the page?')
      .end();
  },

  // test custom amounts

  // test recurring subscriptions

};
