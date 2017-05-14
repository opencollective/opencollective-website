require('dotenv').load();
const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['connect_twitter_button'],

  beforeEach: (client) => resetDb(client)
    .url(`${config.host.website}/testcollective/connect/twitter`)
    .waitForElementVisible('body', 1000)
    .assert.containsText('body', 'CONNECT TO TWITTER'),

  'Redirects to Twitter after clicking connect': (client) => {
    client
      .click('.connectAccountBtn')
      .waitForElementVisible('body', 2000)
      .assert.urlContains('https://api.twitter.com/oauth/authenticate?oauth_token=')
      .setValue('input[id=username_or_email]', config.twitter.testUsername)
      .setValue('input[id=password]', config.twitter.testPassword)
      .click('input[id=allow]') // click 'Sign In'
      .waitForElementVisible('body', 2000)
      .assert.urlContains('http://localhost:3000/testcollective/edit-twitter')
      .end();
  }
};
