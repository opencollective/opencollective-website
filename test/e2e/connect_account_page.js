require('dotenv').load();
const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['connect_account_page'],

  beforeEach: (client) => resetDb(client)
      .url(`${config.host.website}/testcollective/connect/github`)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Connect to github'),

  'Redirects to Github after clicking connect': (client) => {

    const clientId = config.github.clientId;
    const callbackUrl = encodeURIComponent(`${config.host.website}/auth/github/callback/testcollective`);
    const githubScope = encodeURIComponent('user:email');

    client
      .click('.connectAccountBtn')
      .waitForElementVisible('body', 2000)
      .assert.urlContains('https://github.com/login?return_to=%2Flogin%2Foauth%2Fauthorize')
      // TODO set up a GitHub test account
      .setValue('input[name=login]', 'XXXXX')
      .setValue('input[name=password]', 'XXXXX')
      .click('input.btn-primary') // click 'Sign In'

      // This part is only necessary when user wasn't granted a token yet, so must be commented out after first run
      .waitForElementVisible('body', 2000)
      .assert.urlContains(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${githubScope}`)
      .click('button[name=authorize]') // click 'Authorize application'

      .waitForElementVisible('body', 2000)
      .assert.urlContains('http://localhost:3000/testcollective')
      .end();
   }
};
