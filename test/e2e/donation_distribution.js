const config = require('config');
const resetDb = require('../lib/reset_db.js');
const TEST_COLLECTIVE_SLUG = 'testcollective';
const TEST_COLLECTIVE_NAME = 'OpenCollective Test Group';

module.exports = {
  '@tags': ['donations_distribution'],
  beforeEach: (client) => {
    resetDb(client)
      .windowMaximize('current')
      .url(`${config.host.website}/${TEST_COLLECTIVE_SLUG}`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', TEST_COLLECTIVE_NAME)
      .waitForElementVisible('.Button.Button--green', 200)
      .assert.containsText('.Button.Button--green', 'BECOME A BACKER')
  },

  'Shows distribution modal after clicking donate button': (client) => {

    client
      .assert.elementNotPresent('.DonationDistributor-mask')
      .assert.elementNotPresent('.DonationDistributor-container')
      .click('.Button.Button--green')
      .waitForElementVisible('.DonationDistributor-mask', 200)
      .assert.elementPresent('.DonationDistributor-container')
      .click('.DonationDistributor-header small')
      .assert.elementNotPresent('.DonationDistributor-mask')
      .assert.elementNotPresent('.DonationDistributor-container')
      .click('.Button.Button--green')
      .assert.elementPresent('.DonationDistributor-mask')
      .assert.elementPresent('.DonationDistributor-container')
      .assert.elementPresent('.DonationDistributor-header')
      .assert.containsText('.DonationDistributor-header', '€1')
      .assert.containsText('.DonationDistributor-header', 'monthly')
      .assert.containsText('.DonationDistributorItem-label', TEST_COLLECTIVE_NAME)
      .assert.containsText('.DonationDistributorItem-amount', '€1,00')
      .assert.containsText('.DonationDistributorItem-container.--subtotal .DonationDistributorItem-amount', '€1,00')
      .assert.containsText('.DonationDistributorItem-container.--total .DonationDistributorItem-amount', '€1,05') // + commision
      .assert.containsText('.Button', '€1,05')
      .assert.elementPresent('.DonationDistributorItem-container.--paypal')
      .assert.elementPresent('.DonationDistributorItem-container.--stripe')
      .click('.DonationDistributorItem-container.--stripe') 
      .assert.containsText('.DonationDistributorItem-container.--stripe', '€0,33') // .30 + 3%
      .assert.containsText('.DonationDistributorItem-container.--paypal', '')
      .click('.DonationDistributorItem-container.--paypal') 
      .assert.containsText('.DonationDistributorItem-container.--total .DonationDistributorItem-amount', '€1,05')
      .assert.containsText('.Button', '€1,05')
      .end();
  },
};
