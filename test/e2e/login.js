module.exports = {
  beforeEach: (client) => {
    client
      // reset test database
      .url('https://opencollective-test-api.herokuapp.com/database/reset')
      .url("http://localhost:3000/app/login")
      .waitForElementVisible("body", 1000);
  },

  "Load login page with both fields and submit button": (client) => {
    client
      .assert.title("OpenCollective - create and fund your collective transparently")
      .waitForElementVisible('input[type=email', 1000)
      .waitForElementVisible('input[type=password', 1000)
      .waitForElementVisible('button[type=submit', 1000)
      .end();
  },

  "Sign into login page": (client) => {
    client
      .assert.title("OpenCollective - create and fund your collective transparently")
      .setValue('input[type=email]', 'testuser@opencollective.com')
      .setValue('input[type=password', 'password')
      .click('button[type=submit')
      .pause(1000)
      .assert.containsText('body', "My collectives")
      .end();
  },

  "Show error message if the username is wrong": (client) => {
    client
      .assert.title("OpenCollective - create and fund your collective transparently")
      .setValue('input[type=email]', 'wronguser@opencollective.com')
      .setValue('input[type=password', 'password')
      .click('button[type=submit')
      .pause(1000)
      .assert.containsText('body', 'Invalid username/email or password')
      .end();
  },

  "Show error message if the password is missing": (client) => {
    client
      .assert.title("OpenCollective - create and fund your collective transparently")
      .setValue('input[type=email]', 'wronguser@opencollective.com')
      .click('button[type=submit')
      .pause(1000)
      .assert.containsText('body', '"password" is required')
      .end();
  }

};