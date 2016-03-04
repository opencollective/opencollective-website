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

  // this test only exists so the above beforeEach runs
  'sample test': (client) => {
    client.end();
  }
  /**
   * To implement when we fixed the stripe issue
   */
  // 'Donate money - default amount': (client) => {

  //   client

  //     // Click Donate
  //     .click('div[class="Button Button--green"]')
  //     .pause(1000)
  //     .frame(0) // this can range from 0 to 4

  //     // Enter info in the fields and hit submit
  //     .setValue('input[id=email]', 'test12323@34.com')
  //     .keys('\t4242') // Stripe CC field isn't taking a setValue
  //     .keys('4242')
  //     .keys('4242')
  //     .keys('4242')
  //     .setValue('input[id=card_number]', '4242 4242 4242 4242')
  //     .setValue('input[id=cc-exp]', '1/19')
  //     .setValue('input[id=cc-csc]', '123')
  //     .click('button[type=submit]')

  //     // Switch back to the original page
  //     .pause(1000)
  //     .frame(null)

  //     // verify that follow up form showed up
  //     .waitForElementVisible('div[class=PublicGroupSignup]', 1000)
  //     .assert.containsText('div[class=PublicGroupSignup', 'Thanks for the donation. How should we show you on the page?')

  //     .setValue('input[class=Field]:nth-child(1)', 'John Doe')
  //     .setValue('input[class=Field]:nth-child(2)', 'http://www.google.com')
  //     .setValue('input[class=Field]:nth-child(3)', 'opencollect')
  //     .assert.urlContains('Testcollective?status=thankyou')

  //     // check that new backer shows up

  //     // check that the amount updated

  //     .end();
  // },

  // test custom amounts

  // test recurring subscriptions

};