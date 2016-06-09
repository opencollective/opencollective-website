const config = require('config');
const resetDb = require('../lib/reset_db.js');

module.exports = {
  '@tags': ['connect_account_page'],

  beforeEach: (client) => resetDb(client)
    .url(`${config.host.website}/github/apply`)
    .waitForElementVisible('body', 1000),

  'Redirects to Github after clicking connect': (client) => {

    // const clientId = config.github.clientId;
    // const apiKeyEnc = how to have the key reliably?
    // const callbackUrl = encodeURIComponent(`${config.host.website}/connected-accounts/github/callback${apiKeyEnc}`);
    // const githubScope = encodeURIComponent('user:email');

    client
      .click('.OnBoardingButton')
      .assert.containsText('body', 'Sign in to GitHub')
      .assert.urlContains('https://github.com/login?return_to=%2Flogin%2Foauth%2Fauthorize')
      .setValue('input[name=login]', config.github.testUsername)
      .setValue('input[name=password]', config.github.testPassword)
      .click('input.btn-primary') // click 'Sign In'

      // This part is only necessary when user wasn't granted a token yet, so must be commented out after first run
      // .waitForElementVisible('body', 2000)
      // .assert.urlContains(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${githubScope}`)
      // .click('button[name=authorize]') // click 'Authorize application'

      .waitForElementVisible('body', 10000)
      // TODO this returns OK even if it's a 404 page: 404s should change window location
      .assert.urlContains('http://localhost:3000/github/apply')
      .click('.OnBoardingButton') // Repo already selected, click continue
      .pause(500)
      .click('.ContributorPickerItemSearch-list-container') // pick a collaborator
      .click('.OnBoardingButton')
      .pause(500)
      .setValue('textarea[name=mission]', 'fund open source projects')
      .setValue('textarea[name=expensePolicy]', 'pay for servers and tshirts')
      .click('.Checkbox')
      .click('.OnBoardingButton')
      .pause(500)
      .assert.containsText('.OnBoardingButton', 'EXPLORE EXISTING COLLECTIVES')
      .end();
   }
};
