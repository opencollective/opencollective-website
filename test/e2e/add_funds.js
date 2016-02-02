module.exports = {
  '@tags': ['add_funds'],
  beforeEach: (client) => {
    client

      // reset test database
      .url('https://opencollective-test-api.herokuapp.com/database/reset')
      .pause(1000)
      // login
      .url('http://localhost:3000/app/login')
      .waitForElementVisible('body', 1000)
      .setValue('input[type=email]', 'testuser@opencollective.com')
      .setValue('input[type=password]', 'password')
      .click('button[type=submit]')
      .pause(2000)

      // check main page
      .assert.containsText('body', 'My collectives')

      // select a collective
      .click('div[class=GroupLink]')
      .pause(1000)
      .assert.containsText('body', 'CURRENT BALANCE')

      // click on footer
      .click('div[class=Footer-addButton]')
      .pause(1000)
      .waitForElementVisible('div[class=PopOverMenu-group]', 1000)
      .assert.containsText('div[class=PopOverMenu-group]', 'Add funds')

      // click on 'Add funds'
      .click('.js-addFundsLink')
      .pause(1000)
      .assert.containsText('body', 'Add funds to OpenCollective Test Group')
      .assert.urlContains('app/groups/1/funds/');
  },

  'Add funds': (client) => {
    const description = 'Budget for this month'; // TODO: if we don't reset the db, then add a random string here
    const amount = 100;

    client
      .setValue('.js-amount input', amount)
      .setValue('.js-description input', description)

      .click('button[type=submit')
      .pause(1000)
      .assert.urlContains('app/groups/1/transactions')
      .assert.containsText('.Transaction', description.toUpperCase())
      .end();
  },

  'Shows an error message if an empty form is submitted': (client) => {
    client
      .click('button[type=submit')
      .pause(1000)
      .assert.urlContains('app/groups/1/funds/')
      .assert.containsText('.Notification', '"Description" is not allowed to be empty')
      .end();
  }
};