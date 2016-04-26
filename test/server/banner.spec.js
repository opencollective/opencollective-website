const mocks = require('../data/mocks.json');

const api = require('../../server/lib/api');
const app = require('../../server/index');
const request = require('supertest');
const sizeOf = require('image-size');

const sinon = require('sinon');

sinon.stub(api, 'get', () => {
  return Promise.resolve(mocks.users);
});

mocks.backers = mocks.users.filter(u => u.tier == 'backer')
describe("avatar", () => {
  it("wraps the avatar of a backer in a 64x64 SVG", (done) => {
    request(app)
      .get('/yeoman/backers/0/avatar.svg')
      .expect('content-type', 'image/svg+xml; charset=utf-8')
      .expect((res) => {
        res.body = sizeOf(res.body);
      })
      .expect(200, { width: 64, height: 64, type: 'svg' }, done);
  });

  it("wraps the logo of a sponsor in a SVG with maxHeight 64", (done) => {
    request(app)
      .get('/yeoman/sponsor/0/avatar.svg')
      .expect('content-type', 'image/svg+xml; charset=utf-8')
      .expect((res) => {
        console.log("dimensions: ", sizeOf(res.body));
        res.body = sizeOf(res.body);
      })
      .expect(200, { width: 387, height: 64, type: 'svg' }, done);
  });

  it("redirects to the avatar url of the backer", (done) => {
    request(app)
      .get('/yeoman/backers/0/avatar.jpg')
      .expect('content-type', 'image/jpeg')
      .expect(200, done);
  });

  it("redirects to the placeholder avatar url if no avatar for the backer", (done) => {
    request(app)
      .get('/yeoman/backers/1/avatar')
      .expect('Location', '/static/images/user.svg')
      .expect(302, done);
  });

  it("redirects to 'become a backer' placeholder", (done) => {
    request(app)
      .get(`/yeoman/backers/${mocks.backers.length}/avatar`)
      .expect('Location', '/static/images/become_backer.svg')
      .expect(302, done);
  });

  it("redirects to the 1px transparent png if out of bound", (done) => {
    request(app)
      .get(`/yeoman/backers/${(mocks.backers.length+1)}/avatar`)
      .expect('Location', '/static/images/1px.png')
      .expect(302, done);
  });
});

describe("badge", () => {
  it("generates a SVG with the number of backers", (done) => {
    request(app)
      .get('/yeoman/badge/backers.svg')
      .expect('content-type', 'image/svg+xml; charset=utf-8')
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
      .get('/yeoman/backers/1/website')
      .expect('Location', 'https://opencollective.com/yeoman')
      .expect(302, done);
  });

  it(`redirects to the website of the backer (${mocks.backers[3].website})`, (done) => {
    request(app)
      .get('/yeoman/backers/3/website')
      .expect('Location', mocks.backers[3].website)
      .expect(302, done);
  });

  it(`redirects to the twitter of the backer (@${mocks.backers[2].twitterHandle})`, (done) => {
    request(app)
      .get('/yeoman/backers/2/website')
      .expect('Location', `https://twitter.com/${mocks.backers[2].twitterHandle}`)
      .expect(302, done);
  });


})