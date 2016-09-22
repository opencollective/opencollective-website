require('dotenv').load();
const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['connect_meetup_button'],

  beforeEach: (client) => resetDb(client)
    .url(`${config.host.website}/testcollective/connect/meetup`)
    .waitForElementVisible('body', 1000)
    .assert.containsText('body', 'Connect to meetup'),

  'Redirects to Meetup after clicking connect': (client) => {

    // const clientId = config.github.clientId;
    // const callbackUrl = encodeURIComponent(`${config.host.website}/auth/twitter/callback?slug=testcollective`);
    // const githubScope = encodeURIComponent('user:email');

    client
      .click('.connectAccountBtn')
      .waitForElementVisible('body', 2000)
      .assert.urlContains('https://secure.meetup.com/login/?suppress=&apiAppName=OpenCollective_Test&apiAppUrl=&context=oauth&apiAppScopes=ageless&returnUri=https%3A%2F%2Fsecure.meetup.com%2Foauth2%2Fauthorize%2F%3Fsubmit%3D1%26response%3Dyes%26scope%3Dageless%26response_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fapi%252Fconnected-accounts%252Fmeetup%252Fcallback%253Futm_source%253D%2526slug%253Dtestcollective')
      .setValue('input[id=email]', config.meetup.testEmail)
      .setValue('input[id=password]', config.meetup.testPassword)
      .click('input[name=submitButton]') // click 'Sign In'

      // This part is only necessary when user wasn't granted a token yet, so must be commented out after first run
      // .waitForElementVisible('body', 2000)
      // .assert.urlContains(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${githubScope}`)
      // .click('button[name=authorize]') // click 'Authorize application'

      .waitForElementVisible('body', 2000)
      .assert.urlEquals('http://localhost:3000/testcollective')
      .end();
  }
};
