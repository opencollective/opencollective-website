require('dotenv').load();
import config from 'config';
import resetDb from '../lib/reset_db.js';

module.exports = {
  '@tags': ['connect_twitter_button'],

  beforeEach: (client) => resetDb(client)
    .url(`${config.host.website}/testcollective/connect/twitter`)
    .waitForElementVisible('body', 1000)
    .assert.containsText('body', 'Connect to twitter'),

  'Redirects to Twitter after clicking connect': (client) => {

    // const clientId = config.github.clientId;
    // const callbackUrl = encodeURIComponent(`${config.host.website}/auth/twitter/callback?slug=testcollective`);
    // const githubScope = encodeURIComponent('user:email');

    client
      .click('.connectAccountBtn')
      .waitForElementVisible('body', 2000)
      .assert.urlContains('https://api.twitter.com/oauth/authenticate?oauth_token=')
      .setValue('input[id=username_or_email]', config.twitter.testUsername)
      .setValue('input[id=password]', config.twitter.testPassword)
      .click('input[id=allow]') // click 'Sign In'

      // This part is only necessary when user wasn't granted a token yet, so must be commented out after first run
      // .waitForElementVisible('body', 2000)
      // .assert.urlContains(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${githubScope}`)
      // .click('button[name=authorize]') // click 'Authorize application'

      .waitForElementVisible('body', 2000)
      .assert.urlContains('http://localhost:3000/testcollective/edit-twitter')
      .end();
  }
};
