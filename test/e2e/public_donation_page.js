const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['public_donation_page'],
  beforeEach: (client) => {
   resetDb(client)
      .url(`${config.host.website}/testcollective`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'OpenCollective test group on the test server')
      .assert.containsText('.PublicGroupBackers', 'This is possible thanks to you.')

      // wait for bottom green button to show up
      .waitForElementVisible('.Button.Button--green', 40000)
  },

  'Redirects to paypal after clicking donate': (client) => {

    client
      // Click Donate
      .click('.Button.Button--green')
      .pause(10000)
      .assert.urlContains('https://www.sandbox.paypal.com/') // redirected to paypal
      .end();
  },

  'Shows thank you page after a paypal donation if user is full account': (client) => {

    client
      // callback after filling paypal
      .url(`${config.host.website}/testcollective?status=payment_success&userid=1&has_full_account=true`)
      .waitForElementVisible('.PublicGroupThanksV2', 10000)
      .assert.containsText('.PublicGroupThanksV2', 'You are now in our backers wall!')
      .end();
  },

  'Shows the user form after a paypal donation if user does not have a full account': (client) => {

    client
      // callback after filling paypal
      .url(`${config.host.website}/testcollective?status=payment_success&userid=1&has_full_account=false`)
      .waitForElementVisible('.PublicGroupSignupV2', 10000)
      .assert.containsText('.PublicGroupSignupV2', 'How should we show you on the page?')
      .end();
  },

  // test custom amounts

  // test recurring subscriptions

};
