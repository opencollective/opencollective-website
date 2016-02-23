const mocks = require('../data/mocks.json');

const api = require('../../server/lib/api');
const app = require('../../server/index');
const request = require('supertest');

const sinon = require('sinon');

sinon.stub(api, 'get', () => {
  return Promise.resolve(mocks.users);
});

describe("avatar", () => {
  it("redirects to the avatar url of the backer", (done) => {
    request(app)
      .get('/yeoman/backers/0/avatar')
      .expect('content-type', 'image/jpeg')
      .expect(200, done);
  });

  it("redirects to the placeholder avatar url if no avatar for the backer", (done) => {
    request(app)
      .get('/yeoman/backers/1/avatar')
      .expect('Location', '/static/images/user.svg')
      .expect(302, done);
  });

  it("redirects to 'become a sponsor' placeholder", (done) => {
    request(app)
      .get(`/yeoman/backers/${mocks.users.length}/avatar`)
      .expect('Location', '/static/images/becomeASponsor.svg')
      .expect(302, done);
  });

  it("redirects to the 1px transparent png if out of bound", (done) => {
    request(app)
      .get(`/yeoman/backers/${(mocks.users.length+1)}/avatar`)
      .expect('Location', '/static/images/1px.png')
      .expect(302, done);
  });
});

describe("badge", () => {
  it("generates a SVG with the number of backers", (done) => {
    request(app)
      .get('/yeoman/badge/backers.svg')
      .expect('filename', 'backers-5-brightgreen.svg')
      .expect('content-type', 'image/svg+xml;charset=utf-8')
      .expect(200)
      .end(done);
  });
});

describe("redirect", () => {
  
  it("redirects to opencollective.com/:slug if no backer at that position", (done) => {
    request(app)
      .get('/yeoman/backers/999/website')
      .expect('Location', 'https://opencollective.com/yeoman')
      .expect(302, done);
  });

  it("redirects to opencollective.com/:slug if no website or twitter for the backer at that position", (done) => {
    request(app)
      .get('/yeoman/backers/0/website')
      .expect('Location', 'https://opencollective.com/yeoman')
      .expect(302, done);
  });

  it(`redirects to the website of the backer (${mocks.users[3].website})`, (done) => {
    request(app)
      .get('/yeoman/backers/3/website')
      .expect('Location', mocks.users[3].website)
      .expect(302, done);
  });

  it(`redirects to the twitter of the backer (@${mocks.users[5].twitterHandle})`, (done) => {
    request(app)
      .get('/yeoman/backers/5/website')
      .expect('Location', `https://twitter.com/${mocks.users[5].twitterHandle}`)
      .expect(302, done);
  });


})