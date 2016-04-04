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

      // click on top green "Back us" button
      .click('a[href="#support"]')
      .assert.urlContains('#support')

      // wait for bottom green button to show up
      .waitForElementVisible('.Button.Button--green', 1000)
      .assert.containsText('.Button.Button--green', 'BECOME A BACKER')
  },

  'Redirects to paypal after clicking donate': (client) => {

    client
      // Click Donate
      .click('.Button.Button--green')
      .pause(5000)
      .assert.urlContains('https://www.sandbox.paypal.com/') // redirected to paypal
      .end();
  },

  'Shows thank you page after a paypal donation if user is full account': (client) => {

    client
      // callback after filling paypal
      .url(`${config.host.website}/testcollective?status=payment_success&userid=1&has_full_account=true`)
      .waitForElementVisible('.PublicGroupThanksV2', 2000)
      .assert.containsText('body', 'You are now in our backers wall!')
      .end();
  },

  'Shows the user form after a paypal donation if user does not have a full account': (client) => {

    client
      // callback after filling paypal
      .url(`${config.host.website}/testcollective?status=payment_success&userid=1&has_full_account=false`)
      .waitForElementVisible('.PublicGroupSignupV2', 3000)
      .assert.containsText('body', 'How should we show you on the page?')
      .end();
  },

  // test custom amounts

  // test recurring subscriptions

};
